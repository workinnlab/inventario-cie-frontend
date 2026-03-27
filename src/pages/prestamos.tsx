import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Undo2, Trash2, Search, Filter, AlertTriangle, Download, ArrowUpRight, ArrowDownLeft, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { usePrestamos } from '@/hooks/use-prestamos';
import { usePrestatarios } from '@/hooks/use-prestatarios';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobotica } from '@/hooks/use-robotica';
import { useMateriales } from '@/hooks/use-materiales';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Prestamo } from '@/types';
import { Spinner } from '@/components/ui/spinner';

const tabs = ['Todos', 'Activos', 'Vencidos', 'Devueltos'];

export default function PrestamosPage() {
    const { prestamos, isLoading, isError, error, devolverPrestamo, deletePrestamo } = usePrestamos();
    const { prestatarios, isLoading: loadingPrestatarios } = usePrestatarios();
    const { equipos, isLoading: loadingEquipos } = useEquipos();
    const { electronica, isLoading: loadingElectronica } = useElectronica();
    const { robots, isLoading: loadingRobots } = useRobotica();
    const { materiales, isLoading: loadingMateriales } = useMateriales();

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Todos');
    const [deleteModal, setDeleteModal] = useState<Prestamo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

    const isLoadingData = isLoading || loadingPrestatarios || loadingEquipos || loadingElectronica || loadingRobots || loadingMateriales;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar préstamos</h3>
                    <p className="text-sm text-muted-foreground">{error?.message || 'No se pudo conectar con el servidor'}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
                    Intentar de nuevo
                </Button>
            </div>
        );
    }

    const handleDevolver = async (id: number) => {
        try {
            await devolverPrestamo(id);
            toast('Ítem devuelto con éxito', 'success');
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deletePrestamo(deleteModal.id);
            toast('Préstamo eliminado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(err.response?.data?.detail || 'Error al eliminar', 'error');
        }
    };

    const filtered = prestamos.filter((p) => {
        let matchesEstado = true;
        if (activeTab === 'Activos') matchesEstado = p.estado === 'activo';
        if (activeTab === 'Vencidos') matchesEstado = p.estado === 'vencido';
        if (activeTab === 'Devueltos') matchesEstado = p.estado === 'devuelto';

        const prestatario = (prestatarios.find(pr => pr.id === p.prestatario_id)?.nombre || '').toLowerCase();
        const matchesSearch = prestatario.includes(search.toLowerCase()) ||
            (p.observaciones || '').toLowerCase().includes(search.toLowerCase());
        return matchesEstado && matchesSearch;
    });

    // Paginación
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    const getPrestatarioName = (id: number) => prestatarios.find(p => p.id === id)?.nombre || 'Desconocido';

    const getItemName = (p: Prestamo) => {
        if (p.equipo_id) return equipos.find(e => e.id === p.equipo_id)?.nombre || `Equipo #${p.equipo_id}`;
        if (p.electronica_id) return electronica.find(e => e.id === p.electronica_id)?.nombre || `Electrónica #${p.electronica_id}`;
        if (p.robot_id) return robots.find(e => e.id === p.robot_id)?.nombre || `Robot #${p.robot_id}`;
        if (p.material_id) return materiales.find(e => e.id === p.material_id)?.color || `Material #${p.material_id}`;
        return 'N/A';
    };

    const getBadgeVariant = (estado: string) => {
        switch (estado) {
            case 'activo': return 'warning';
            case 'devuelto': return 'success';
            case 'vencido': return 'destructive';
            case 'perdido': return 'destructive';
            default: return 'secondary';
        }
    };

    const columns: any = [
        { key: 'id', header: 'ID', className: 'w-16 font-mono text-muted-foreground' },
        {
            key: 'prestatario',
            header: 'Prestatario',
            render: (p: Prestamo) => <span className="font-bold text-[#2d3335]">{getPrestatarioName(p.prestatario_id)}</span>
        },
        { key: 'item', header: 'Ítem', className: 'font-medium', render: (p: Prestamo) => getItemName(p) },
        { key: 'fecha_prestamo', header: 'Fecha Préstamo', className: 'text-muted-foreground', render: (p: Prestamo) => formatDate(p.fecha_prestamo) },
        { key: 'fecha_limite', header: 'Fecha Límite', className: 'text-muted-foreground', render: (p: Prestamo) => p.fecha_limite ? formatDate(p.fecha_limite) : '-' },
        {
            key: 'estado',
            header: 'Estado',
            render: (p: Prestamo) => (
                <Badge variant={getBadgeVariant(p.estado)}>
                    {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                </Badge>
            )
        },
        {
            key: 'actions',
            header: '',
            className: 'w-24 text-right',
            render: (p: Prestamo) => (
                <div className="flex justify-end gap-2 pr-4">
                    {(p.estado === 'activo' || p.estado === 'vencido') && canEdit && (
                        <button className="text-muted-foreground hover:text-[#4f645b] transition-colors p-2" title="Devolver" onClick={() => handleDevolver(p.id)}>
                            <Undo2 className="h-4 w-4" />
                        </button>
                    )}
                    {canDelete && (
                        <button className="text-muted-foreground hover:text-destructive transition-colors p-2" title="Eliminar" onClick={() => setDeleteModal(p)}>
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] tracking-tighter leading-none">Préstamos</h2>
                    <p className="text-[#5a6062] max-w-md">Gestiona los préstamos de equipos y materiales del inventario.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-5 rounded-full gap-2 font-semibold">
                        <Filter className="h-4 w-4" /> Filtros
                    </Button>
                    <Button variant="outline" className="h-12 px-5 rounded-full gap-2 font-semibold">
                        <Download className="h-4 w-4" /> Exportar
                    </Button>
                    {canEdit && (
                        <Link to="/prestamos/nuevo">
                            <Button className="h-12 px-6 rounded-full gap-2 font-bold shadow-md">
                                <Plus className="h-4 w-4" /> Nuevo Préstamo
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab
                            ? 'bg-[#4f645b] text-white'
                            : 'bg-[#f1f4f5] text-[#5a6062] hover:bg-[#dee3e6]'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        placeholder="Buscar préstamo..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] pl-12 pr-4 text-sm placeholder:text-muted-foreground transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] focus:border-[#4f645b]"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 p-5 rounded-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-yellow-600">{prestamos.filter(p => p.estado === 'activo').length}</p>
                        <p className="text-xs text-yellow-600/70 font-medium">Préstamos Activos</p>
                    </div>
                </div>
                <div className="bg-green-50 p-5 rounded-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <RefreshCcw className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-green-600">{prestamos.filter(p => p.estado === 'devuelto').length}</p>
                        <p className="text-xs text-green-600/70 font-medium">Devoluciones Históricas</p>
                    </div>
                </div>
                <div className="bg-red-50 p-5 rounded-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-red-600">{prestamos.filter(p => p.estado === 'vencido').length}</p>
                        <p className="text-xs text-red-600/70 font-medium">Préstamos Vencidos</p>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                <Table columns={columns} data={paginatedData} loading={isLoadingData} emptyMessage="No hay préstamos registrados" />

                {/* Pagination */}
                {!isLoadingData && filtered.length > 0 && (
                    <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between text-sm text-muted-foreground font-medium">
                        <span>Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} registros</span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-xl font-bold transition-colors ${currentPage === page
                                            ? 'bg-[#E8F3EE] text-[#4f645b]'
                                            : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30"
                            >
                                <ArrowLeft className="h-4 w-4 rotate-180" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete confirmation */}
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        ¿Estás seguro de eliminar el registro de préstamo #{deleteModal?.id}? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} className="px-8">Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
