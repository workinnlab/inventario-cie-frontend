import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Undo2, Trash2, Search, Filter, AlertTriangle, Download, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useSearch } from '@/contexts/search-context';
import { usePrestamos } from '@/hooks/use-prestamos';
import { usePrestatarios } from '@/hooks/use-prestatarios';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobotica } from '@/hooks/use-robotica';
import { useMateriales } from '@/hooks/use-materiales';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Prestamo, Column } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

const tabs = ['Todos', 'Activos', 'Vencidos', 'Devueltos'];

export default function PrestamosPage() {
    const { prestamos, isLoading, isError, error, devolverPrestamo, deletePrestamo } = usePrestamos();
    const { prestatarios, isLoading: loadingPrestatarios } = usePrestatarios();
    const { equipos, isLoading: loadingEquipos } = useEquipos();
    const { electronica, isLoading: loadingElectronica } = useElectronica();
    const { robots, isLoading: loadingRobots } = useRobotica();
    const { materiales, isLoading: loadingMateriales } = useMateriales();

    const [searchParams, setSearchParams] = useSearchParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Todos');
    const [deleteModal, setDeleteModal] = useState<Prestamo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

    const isLoadingData = isLoading || loadingPrestatarios || loadingEquipos || loadingElectronica || loadingRobots || loadingMateriales;

    // Sincronizar búsqueda global con búsqueda local
    useEffect(() => {
        const globalSearch = searchParams.get('search');
        if (globalSearch) {
            setSearch(globalSearch);
            setSearchQuery(globalSearch);
        }
    }, [searchParams, setSearchQuery]);

    const handleLocalSearch = (value: string) => {
        setSearch(value);
        setSearchQuery(value);
        setCurrentPage(1);
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('search', value);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams);
    };

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

    const filtered = useMemo(() => {
        return prestamos.filter((p) => {
            const tabEstadoMap: Record<string, string> = {
                'Activos': 'activo',
                'Vencidos': 'vencido',
                'Devueltos': 'devuelto',
            };

            const matchesEstado = activeTab === 'Todos' || p.estado === tabEstadoMap[activeTab];

            const prestatario = (prestatarios.find(pr => pr.id === p.prestatario_id)?.nombre || '').toLowerCase();
            const matchesSearch = prestatario.includes(search.toLowerCase()) ||
                (p.observaciones || '').toLowerCase().includes(search.toLowerCase());
            return matchesEstado && matchesSearch;
        }).sort((a, b) => {
            const nombreA = prestatarios.find(pr => pr.id === a.prestatario_id)?.nombre || '';
            const nombreB = prestatarios.find(pr => pr.id === b.prestatario_id)?.nombre || '';
            return nombreA.localeCompare(nombreB);
        });
    }, [prestamos, prestatarios, activeTab, search]);

    const { paginatedItems, totalPages, totalItems, startItem, endItem } = usePagination(filtered, 20);

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

    const columns: Column<Prestamo>[] = [
        { key: 'id', header: 'ID', className: 'w-16 font-mono text-muted-foreground' },
        {
            key: 'prestatario',
            header: 'Prestatario',
            render: (p: Prestamo) => <span className="font-bold text-[#2d3335] dark:text-[#fdfdfd]">{getPrestatarioName(p.prestatario_id)}</span>
        },
        { key: 'item', header: 'Ítem', className: 'font-medium dark:text-[#dddeff]', render: (p: Prestamo) => getItemName(p) },
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
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Préstamos</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Gestiona los préstamos de equipos y materiales del inventario.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-5 rounded-full gap-2 font-semibold dark:bg-[#292a69] dark:text-[#fdfdfd] dark:hover:bg-[#3b438e]/50">
                        <Download className="h-4 w-4" /> Exportar
                    </Button>
                    {canEdit && (
                        <Link to="/prestamos/nuevo">
                            <Button className="h-12 px-6 rounded-full gap-2 font-bold shadow-md dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]">
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
                            ? 'bg-[#4f645b] dark:bg-[#3b438e] text-white'
                            : 'bg-[#f1f4f5] dark:bg-[#292a69] text-[#5a6062] dark:text-[#dddeff] hover:bg-[#dee3e6] dark:hover:bg-[#3b438e]/70'
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
                        onChange={(e) => handleLocalSearch(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 pl-12 pr-4 text-sm dark:text-[#fdfdfd] placeholder:text-muted-foreground dark:placeholder:text-[#7b7b8b] transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] dark:focus:ring-[#3b438e]/50 focus:border-[#4f645b] dark:focus:border-[#3b438e]"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{prestamos.filter(p => p.estado === 'activo').length}</p>
                        <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 font-medium">Préstamos Activos</p>
                    </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <RefreshCcw className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-green-600 dark:text-green-400">{prestamos.filter(p => p.estado === 'devuelto').length}</p>
                        <p className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">Devoluciones Históricas</p>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-red-600 dark:text-red-400">{prestamos.filter(p => p.estado === 'vencido').length}</p>
                        <p className="text-xs text-red-600/70 dark:text-red-400/70 font-medium">Préstamos Vencidos</p>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <Table columns={columns} data={paginatedItems} loading={isLoadingData} emptyMessage="No hay préstamos registrados" />

                {/* Pagination */}
                {!isLoadingData && filtered.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                        onPageChange={setCurrentPage}
                        label="préstamos"
                    />
                )}
            </div>

            {/* Delete confirmation */}
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <div className="pt-2">
                    <p className="text-sm text-muted-foreground dark:text-[#7b7b8b] mb-6 leading-relaxed">
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
