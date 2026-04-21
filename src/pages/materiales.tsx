import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, AlertTriangle, Download, Filter, Package, Droplet, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useSearch } from '@/contexts/search-context';
import { useMateriales } from '@/hooks/use-materiales';
import { Spinner } from '@/components/ui/spinner';
import type { Material, MaterialCreate, Column } from '@/types';
import { getErrorMessage } from '@/utils/error-handler';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

const tabs = ['Todos', 'Filamento', 'Resina', 'Otros'];

const getIcon = (categoria: string) => {
    if (categoria === 'Filamento') return <Box className="h-5 w-5" />;
    if (categoria === 'Resina') return <Droplet className="h-5 w-5" />;
    return <Package className="h-5 w-5" />;
};

export default function MaterialesPage() {
    const { materiales, isLoading, isError, error, createMaterial, updateMaterial, deleteMaterial, isCreating, isUpdating } = useMateriales();
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(searchParams.get('new') === 'true');
    const [deleteModal, setDeleteModal] = useState<Material | null>(null);
    const [editing, setEditing] = useState<Material | null>(null);
    const [form, setForm] = useState<MaterialCreate>({ color: '', cantidad: '', categoria: 'Filamento', usado: 0, en_uso: 0, en_stock: 0 });
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
                    <h3 className="font-semibold">Error al cargar materiales</h3>
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
        setForm({ color: '', cantidad: '', categoria: 'Filamento', usado: 0, en_uso: 0, en_stock: 0 });
        setModalOpen(true);
    };

    const openEdit = (item: Material) => {
        setEditing(item);
        setForm({ color: item.color, cantidad: item.cantidad, categoria: item.categoria, usado: item.usado, en_uso: item.en_uso, en_stock: item.en_stock });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await updateMaterial({ id: editing.id, data: form });
                toast('Material actualizado', 'success');
            } else {
                await createMaterial(form);
                toast('Material creado', 'success');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deleteMaterial(deleteModal.id);
            toast('Material eliminado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const filtered = useMemo(() => {
        return materiales.filter((m) => {
            const matchesSearch = (m.color || '').toLowerCase().includes(search.toLowerCase()) ||
                (m.cantidad || '').toLowerCase().includes(search.toLowerCase());
            const matchesTab = activeTab === 'Todos' || m.categoria === activeTab;
            return matchesSearch && matchesTab;
        }).sort((a, b) => (a.color || '').localeCompare(b.color || ''));
    }, [materiales, search, activeTab]);

    const { paginatedItems, currentPage, setCurrentPage, totalPages, totalItems, startItem, endItem } = usePagination(filtered, 20);

    const getStockBadge = (enStock: number) => {
        if (enStock === 0) return <Badge variant="destructive">Agotado</Badge>;
        if (enStock <= 5) return <Badge variant="warning">Stock bajo</Badge>;
        return <Badge variant="success">Disponible</Badge>;
    };

    const columns: any = [
        {
            key: 'nombre',
            header: 'Material',
            render: (m: Material) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#d1e8dd] dark:bg-[#3b438e] flex items-center justify-center text-[#4f645b] dark:text-[#fdfdfd]">
                        {getIcon(m.categoria)}
                    </div>
                    <div>
                        <p className="font-bold text-[#2d3335] dark:text-[#fdfdfd] leading-tight">{m.color}</p>
                        <p className="text-xs text-[#5a6062] dark:text-[#dddeff]">{m.cantidad}</p>
                    </div>
                </div>
            )
        },
        { key: 'categoria', header: 'Categoría', render: (m: Material) => <span className="font-medium dark:text-[#dddeff]">{m.categoria}</span> },
        { key: 'en_stock', header: 'Stock', render: (m: Material) => <span className="font-bold text-green-600 dark:text-green-400">{m.en_stock}</span> },
        { key: 'en_uso', header: 'En Uso', render: (m: Material) => <span className="font-medium text-[#486277] dark:text-[#dddeff]">{m.en_uso}</span> },
        { key: 'usado', header: 'Usado', render: (m: Material) => <span className="font-medium text-[#486277] dark:text-[#dddeff]">{m.usado}</span> },
        { key: 'total', header: 'Total', render: (m: Material) => <span className="font-bold dark:text-[#fdfdfd]">{m.total}</span> },
        { key: 'estado', header: 'Estado', render: (m: Material) => getStockBadge(m.en_stock) },
        ...(canEdit || canDelete ? [{
            key: 'actions',
            header: '',
            className: 'w-24 text-right',
            render: (m: Material) => (
                <div className="flex justify-end gap-2 pr-4">
                    {canEdit && (
                        <button className="text-muted-foreground hover:text-[#4f645b] transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); openEdit(m); }}>
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}
                    {canDelete && (
                        <button className="text-muted-foreground hover:text-destructive transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(m); }}>
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
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Materiales</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Gestiona los materiales del inventario (filamentos, resinas, etc.).</p>
                </div>
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <Button onClick={openCreate} className="h-12 px-6 rounded-full gap-2 font-bold shadow-md dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]">
                            <Plus className="h-4 w-4" /> Nuevo Material
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
                            ? 'bg-[#4f645b] dark:bg-[#3b438e] text-white'
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
                        placeholder="Buscar material..."
                        value={search}
                        onChange={(e) => handleLocalSearch(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 pl-12 pr-4 text-sm dark:text-[#fdfdfd] placeholder:text-muted-foreground dark:placeholder:text-[#7b7b8b] transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d1e8dd] dark:focus:ring-[#3b438e]/50 focus:border-[#4f645b] dark:focus:border-[#3b438e]"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <Table columns={columns} data={paginatedItems} loading={isLoading} emptyMessage="No se encontraron materiales" />

                {!isLoading && filtered.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                        onPageChange={setCurrentPage}
                        label="materiales"
                    />
                )}
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Material' : 'Nuevo Material'}>
                <div className="space-y-4 pt-2">
                    <Input label="Color/Tipo" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required placeholder="ej: PLA Blanco" />
                    <Input label="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} required placeholder="ej: 1kg, 500g" />
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#2d3335] dark:text-[#fdfdfd] ml-1">Categoría</label>
                        <select
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value as any })}
                            className="w-full h-12 px-4 bg-[#f1f4f5] border-none rounded-xl focus:ring-2 focus:ring-[#4f645b]/20 text-sm font-medium"
                        >
                            <option value="Filamento">Filamento</option>
                            <option value="Resina">Resina</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <Input label="Stock" type="number" value={form.en_stock} onChange={(e) => setForm({ ...form, en_stock: parseInt(e.target.value) || 0 })} />
                    <Input label="En Uso" type="number" value={form.en_uso} onChange={(e) => setForm({ ...form, en_uso: parseInt(e.target.value) || 0 })} />
                    <Input label="Usado" type="number" value={form.usado} onChange={(e) => setForm({ ...form, usado: parseInt(e.target.value) || 0 })} />
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
                    <p className="text-sm text-muted-foreground mb-6">¿Estás seguro de eliminar <strong>{deleteModal?.color}</strong> ({deleteModal?.cantidad})?</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} className="px-8">Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
