import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, AlertTriangle, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useSearch } from '@/contexts/search-context';
import { useRobotica } from '@/hooks/use-robotica';
import { Spinner } from '@/components/ui/spinner';
import type { Robot, RobotCreate, Column } from '@/types';
import { getErrorMessage } from '@/utils/error-handler';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

const estadoOptions = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'en_uso', label: 'En uso' },
    { value: 'fuera_de_servicio', label: 'Fuera de servicio' },
];

const tabs = ['Todos', 'Disponibles', 'En Uso', 'Fuera de Servicio'];

export default function RoboticaPage() {
    const { robots, isLoading, isError, error, createRobot, updateRobot, deleteRobot, isCreating, isUpdating } = useRobotica();
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(searchParams.get('new') === 'true');
    const [deleteModal, setDeleteModal] = useState<Robot | null>(null);
    const [editing, setEditing] = useState<Robot | null>(null);
    const [form, setForm] = useState<RobotCreate>({
        nombre: '',
        disponible: 0,
        en_uso: 0,
        fuera_de_servicio: 0,
    });
    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

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
                    <h3 className="font-semibold">Error al cargar robots</h3>
                    <p className="text-sm text-muted-foreground">{error?.message || 'No se pudo conectar con el servidor'}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
                    Intentar de nuevo
                </Button>
            </div>
        );
    }

    const openCreate = () => {
        setEditing(null);
        setForm({ nombre: '', disponible: 0, en_uso: 0, fuera_de_servicio: 0 });
        setModalOpen(true);
    };

    const openEdit = (robot: Robot) => {
        setEditing(robot);
        setForm({ 
            nombre: robot.nombre, 
            disponible: robot.disponible, 
            en_uso: robot.en_uso, 
            fuera_de_servicio: robot.fuera_de_servicio 
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await updateRobot({ id: editing.id, data: form });
                toast('Robot actualizado', 'success');
            } else {
                await createRobot(form);
                toast('Robot creado', 'success');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deleteRobot(deleteModal.id);
            toast('Robot eliminado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const filtered = useMemo(() => {
        return robots.filter((r) => {
            const matchesSearch = (r.nombre || '').toLowerCase().includes(search.toLowerCase());

            const tabConditions: Record<string, (r: Robot) => boolean> = {
                'Disponibles': (r) => r.disponible > 0,
                'En Uso': (r) => r.en_uso > 0,
                'Fuera de Servicio': (r) => r.fuera_de_servicio > 0,
            };

const matchesTab = activeTab === 'Todos' || tabConditions[activeTab]?.(r);
 
            return matchesSearch && matchesTab;
        }).sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    }, [robots, search, activeTab]);

    const { paginatedItems, currentPage, setCurrentPage, totalPages, totalItems, startItem, endItem } = usePagination(filtered, 20);

    const getBadgeVariant = (disponible: number, en_uso: number, fuera: number) => {
        if (fuera > 0) return 'destructive';
        if (en_uso > 0) return 'warning';
        return 'success';
    };

    const getEstadoLabel = (disponible: number, en_uso: number, fuera: number) => {
        if (fuera > 0) return 'Fuera de servicio';
        if (en_uso > 0) return 'En uso';
        return 'Disponible';
    };

    const columns: Column<Robot>[] = [
        { key: 'id', header: 'ID', className: 'w-16 font-mono text-muted-foreground' },
        {
            key: 'nombre',
            header: 'Nombre',
            render: (r: Robot) => <span className="font-bold text-[#1a1f1c] dark:text-[#fdfdfd]">{r.nombre}</span>
        },
        { 
            key: 'disponible', 
            header: 'Disponibles',
            render: (r: Robot) => <span className="font-medium text-green-600 dark:text-green-400">{r.disponible}</span>
        },
        { 
            key: 'en_uso', 
            header: 'En Uso',
            render: (r: Robot) => <span className="font-medium text-[#486277] dark:text-[#dddeff]">{r.en_uso}</span>
        },
        { 
            key: 'fuera_de_servicio', 
            header: 'Fuera de Servicio',
            render: (r: Robot) => <span className="font-medium text-red-500 dark:text-red-400">{r.fuera_de_servicio}</span>
        },
        { 
            key: 'total', 
            header: 'Total',
            render: (r: Robot) => <span className="font-bold">{r.total}</span>
        },
        {
            key: 'estado',
            header: 'Estado',
            render: (r: Robot) => (
                <Badge variant={getBadgeVariant(r.disponible, r.en_uso, r.fuera_de_servicio)}>
                    {getEstadoLabel(r.disponible, r.en_uso, r.fuera_de_servicio)}
                </Badge>
            ),
        },
        ...(canEdit || canDelete ? [{
            key: 'actions',
            header: '',
            className: 'w-24 text-right',
            render: (r: Robot) => (
                <div className="flex justify-end gap-2 pr-4">
                    {canEdit && (
                        <button className="text-muted-foreground hover:text-[#4f645b] transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); openEdit(r); }}>
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}
                    {canDelete && (
                        <button className="text-muted-foreground hover:text-destructive transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(r); }}>
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ),
        }] : []),
    ];

    if (isLoading) {
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
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Robótica</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Gestiona y monitorea el estado de todos los robots y componentes de robótica.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <Button onClick={openCreate} className="h-12 px-6 rounded-full gap-2 font-bold shadow-md dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]">
                            <Plus className="h-4 w-4" /> Nuevo Robot
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
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
                        placeholder="Buscar robot..."
                        value={search}
                        onChange={(e) => handleLocalSearch(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 pl-12 pr-4 text-sm dark:text-[#fdfdfd] placeholder:text-muted-foreground dark:placeholder:text-[#7b7b8b] transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] dark:focus:ring-[#3b438e]/50 focus:border-[#4f645b] dark:focus:border-[#3b438e]"
                    />
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <Table columns={columns} data={paginatedItems} loading={isLoading} emptyMessage="No se encontraron robots" />

                {/* Pagination */}
                {!isLoading && filtered.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                        onPageChange={setCurrentPage}
                        label="robots"
                    />
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Robot' : 'Nuevo Robot'}>
                <div className="space-y-4 pt-2">
                    <Input 
                        label="Nombre" 
                        value={form.nombre} 
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                        required 
                    />
                    <Input 
                        label="Cantidad Disponible" 
                        type="number"
                        value={form.disponible} 
                        onChange={(e) => setForm({ ...form, disponible: parseInt(e.target.value) || 0 })} 
                    />
                    <Input 
                        label="Cantidad en Uso" 
                        type="number"
                        value={form.en_uso} 
                        onChange={(e) => setForm({ ...form, en_uso: parseInt(e.target.value) || 0 })} 
                    />
                    <Input 
                        label="Cantidad Fuera de Servicio" 
                        type="number"
                        value={form.fuera_de_servicio} 
                        onChange={(e) => setForm({ ...form, fuera_de_servicio: parseInt(e.target.value) || 0 })} 
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating} className="px-8">
                            {editing ? (isUpdating ? <Spinner size="sm" /> : 'Guardar') : (isCreating ? <Spinner size="sm" /> : 'Crear')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete confirmation */}
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        ¿Estás seguro de eliminar <strong className="text-foreground">{deleteModal?.nombre}</strong>? Esta acción no se puede deshacer.
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
