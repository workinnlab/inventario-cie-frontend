import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useElectronica } from '@/hooks/use-electronica';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Electronica, ElectronicaCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';


export default function ElectronicaPage() {
    const {
        electronica: items,
        isLoading,
        isError,
        error,
        createElectronica,
        updateElectronica,
        deleteElectronica,
        isCreating,
        isUpdating,
        // Paginación y búsqueda ahora vienen del hook
        page,
        totalPages,
        setPage,
        search,
        setSearch,
    } = useElectronica();

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Electronica | null>(null);
    const [editing, setEditing] = useState<Electronica | null>(null);
    const [form, setForm] = useState<ElectronicaCreate>({ nombre: '', descripcion: '', tipo: '', en_uso: 0, en_stock: 0 });
    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

    // Manejo de errores de API
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar electrónica</h3>
                    <p className="text-sm text-muted-foreground">
                        {error?.message || 'No se pudo conectar con el servidor'}
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Intentar de nuevo
                </Button>
            </div>
        );
    }


    const openCreate = () => { setEditing(null); setForm({ nombre: '', descripcion: '', tipo: '', en_uso: 0, en_stock: 0 }); setModalOpen(true); };
    const openEdit = (item: Electronica) => { setEditing(item); setForm({ nombre: item.nombre, descripcion: item.descripcion || '', tipo: item.tipo || '', en_uso: item.en_uso, en_stock: item.en_stock }); setModalOpen(true); };

    const handleSave = async () => {
        try {
            if (editing) { await updateElectronica({ id: editing.id, data: form }); toast('Actualizado', 'success'); }
            else { await createElectronica(form); toast('Creado', 'success'); }
            setModalOpen(false);
        } catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };


    const handleDelete = async () => {
        if (!deleteModal) return;
        try { await deleteElectronica(deleteModal.id); toast('Eliminado', 'success'); setDeleteModal(null); }
        catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };


    const filtered = items.filter(e => (e.nombre || '').toLowerCase().includes(search.toLowerCase()));

    const columns = [
        { key: 'nombre', header: 'Nombre' },
        { key: 'tipo', header: 'Tipo', render: (e: Electronica) => e.tipo || '-' },
        { key: 'en_stock', header: 'En Stock' },
        { key: 'en_uso', header: 'En Uso' },
        { key: 'total', header: 'Total' },
        { key: 'created_at', header: 'Creado', render: (e: Electronica) => formatDate(e.created_at) },
        ...(canEdit ? [{
            key: 'actions', header: '', className: 'w-24', render: (e: Electronica) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    {canDelete && <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(e); }}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>}
                </div>
            )
        }] : []),
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* Búsqueda — ahora controlada por el hook, llama a la API */}
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                {canEdit && (
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" /> Nuevo
                    </Button>
                )}
            </div>
 
            {/* Tabla — ya no usa `filtered`, usa directamente los items de la página actual */}
            <Table columns={columns} data={items} loading={isLoading} emptyMessage="No hay elementos" />
 
            {/* Paginación */}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
 
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar' : 'Nuevo elemento'}>
                <div className="space-y-3">
                    <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <Input label="Descripción" value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                    <Input label="Tipo" value={form.tipo || ''} onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="En Stock" type="number" value={form.en_stock} onChange={(e) => setForm({ ...form, en_stock: +e.target.value })} />
                        <Input label="En Uso" type="number" value={form.en_uso} onChange={(e) => setForm({ ...form, en_uso: +e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                            {editing ? (isUpdating ? <Spinner size="sm" /> : 'Guardar') : (isCreating ? <Spinner size="sm" /> : 'Crear')}
                        </Button>
                    </div>
                </div>
            </Modal>
 
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <p className="text-sm text-muted-foreground mb-4">¿Eliminar <strong>{deleteModal?.nombre}</strong>?</p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
}
