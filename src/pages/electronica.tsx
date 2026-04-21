import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, AlertTriangle, Download, Filter, Cpu, Zap, Cable, Forward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useSearch } from '@/contexts/search-context';
import { useElectronica } from '@/hooks/use-electronica';
import { Spinner } from '@/components/ui/spinner';
import type { Electronica, ElectronicaCreate, Column } from '@/types';
import { getErrorMessage } from '@/utils/error-handler';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

const tabs = ['Todos', 'Disponibles', 'En Uso', 'Agotados'];

const getIcon = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('arduino') || n.includes('esp') || n.includes('microcontrolador')) return <Cpu className="h-5 w-5" />;
    if (n.includes('sensor')) return <Zap className="h-5 w-5" />;
    if (n.includes('cable') || n.includes('conector')) return <Cable className="h-5 w-5" />;
    if (n.includes('fuente') || n.includes('alimentacion')) return <Forward className="h-5 w-5" />;
    return <Cpu className="h-5 w-5" />;
};

export default function ElectronicaPage() {
    const { electronica, isLoading, isError, error, createElectronica, updateElectronica, deleteElectronica, isCreating, isUpdating } = useElectronica();
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(searchParams.get('new') === 'true');
    const [deleteModal, setDeleteModal] = useState<Electronica | null>(null);
    const [editing, setEditing] = useState<Electronica | null>(null);
    const [form, setForm] = useState<ElectronicaCreate>({
        nombre: '', descripcion: '', tipo: '', en_uso: 0, en_stock: 0,
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
                    <h3 className="font-semibold">Error al cargar electrónica</h3>
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
        setForm({ nombre: '', descripcion: '', tipo: '', en_uso: 0, en_stock: 0 });
        setModalOpen(true);
    };

    const openEdit = (item: Electronica) => {
        setEditing(item);
        setForm({ nombre: item.nombre, descripcion: item.descripcion || '', tipo: item.tipo || '', en_uso: item.en_uso, en_stock: item.en_stock });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await updateElectronica({ id: editing.id, data: form });
                toast('Electrónica actualizada', 'success');
            } else {
                await createElectronica(form);
                toast('Electrónica creada', 'success');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deleteElectronica(deleteModal.id);
            toast('Electrónica eliminada', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const filtered = useMemo(() => {
        return electronica.filter((e) => {
            const matchesSearch = (e.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
                (e.tipo || '').toLowerCase().includes(search.toLowerCase());

            const tabConditions: Record<string, (e: Electronica) => boolean> = {
                'Disponibles': (e) => e.en_stock > 0 && e.en_uso === 0,
                'En Uso': (e) => e.en_uso > 0,
                'Agotados': (e) => e.en_stock === 0,
            };

            const matchesTab = activeTab === 'Todos' || tabConditions[activeTab]?.(e);

            return matchesSearch && matchesTab;
        });
    }, [electronica, search, activeTab]);

    const { paginatedItems, currentPage, setCurrentPage, totalPages, totalItems, startItem, endItem } = usePagination(filtered, 20);

    const columns: Column<Electronica>[] = [
        {
            key: 'nombre',
            header: 'Nombre',
            render: (e: Electronica) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#cae6fe] dark:bg-[#3b438e] flex items-center justify-center text-[#486277] dark:text-[#fdfdfd]">
                        {getIcon(e.nombre)}
                    </div>
                    <div>
                        <p className="font-bold text-[#2d3335] dark:text-[#fdfdfd] leading-tight">{e.nombre}</p>
                        <p className="text-xs text-[#5a6062] dark:text-[#dddeff]">{e.tipo || 'Sin tipo'}</p>
                    </div>
                </div>
            )
        },
        { key: 'descripcion', header: 'Descripción', render: (e: Electronica) => <span className="text-muted-foreground dark:text-[#dddeff]">{e.descripcion || '-'}</span> },
        { key: 'en_stock', header: 'Stock', render: (e: Electronica) => <span className="font-medium text-green-600 dark:text-green-400">{e.en_stock}</span> },
        { key: 'en_uso', header: 'En Uso', render: (e: Electronica) => <span className="font-medium text-[#486277] dark:text-[#dddeff]">{e.en_uso}</span> },
        { key: 'total', header: 'Total', render: (e: Electronica) => <span className="font-bold">{e.total}</span> },
        ...(canEdit || canDelete ? [{
            key: 'actions',
            header: '',
            className: 'w-24 text-right',
            render: (e: Electronica) => (
                <div className="flex justify-end gap-2 pr-4">
                    {canEdit && (
                        <button className="text-muted-foreground hover:text-[#4f645b] transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}>
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}
                    {canDelete && (
                        <button className="text-muted-foreground hover:text-destructive transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(e); }}>
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Electrónica</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Gestiona todos los componentes electrónicos del inventario.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-5 rounded-full gap-2 font-semibold dark:bg-[#292a69] dark:text-[#fdfdfd] dark:hover:bg-[#3b438e]/50">
                        <Filter className="h-4 w-4" /> Filtros
                    </Button>
                    {canEdit && (
                        <Button onClick={openCreate} className="h-12 px-6 rounded-full gap-2 font-bold shadow-md dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]">
                            <Plus className="h-4 w-4" /> Nuevo Item
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab
                            ? 'bg-[#486277] dark:bg-[#5a62b8] text-white'
                            : 'bg-[#f1f4f5] dark:bg-[#292a69] text-[#5a6062] dark:text-[#dddeff] hover:bg-[#dee3e6] dark:hover:bg-[#3b438e]/70'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        placeholder="Buscar electrónica..."
                        value={search}
                        onChange={(e) => handleLocalSearch(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 pl-12 pr-4 text-sm dark:text-[#fdfdfd] placeholder:text-muted-foreground dark:placeholder:text-[#7b7b8b] transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#cae6fe] dark:focus:ring-[#3b438e]/50 focus:border-[#486277] dark:focus:border-[#3b438e]"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <Table columns={columns} data={paginatedItems} loading={isLoading} emptyMessage="No se encontraron items" />

                {!isLoading && filtered.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                        onPageChange={setCurrentPage}
                        label="registros"
                    />
                )}
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Item' : 'Nuevo Item'}>
                <div className="space-y-4 pt-2">
                    <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <Input label="Descripción" value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                    <Input label="Tipo" value={form.tipo || ''} onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
                    <Input label="Stock" type="number" value={form.en_stock} onChange={(e) => setForm({ ...form, en_stock: parseInt(e.target.value) || 0 })} />
                    <Input label="En Uso" type="number" value={form.en_uso} onChange={(e) => setForm({ ...form, en_uso: parseInt(e.target.value) || 0 })} />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating} className="px-8">
                            {editing ? (isUpdating ? <Spinner size="sm" /> : 'Guardar') : (isCreating ? <Spinner size="sm" /> : 'Crear')}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-6">¿Estás seguro de eliminar <strong>{deleteModal?.nombre}</strong>?</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} className="px-8">Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
