import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { usePrestatarios } from '@/hooks/use-prestatarios';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Prestatario, PrestatarioCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';

export default function PrestatariosPage() {
    const { prestatarios: items, isLoading, isError, error, createPrestatario, updatePrestatario, deletePrestatario, isCreating, isUpdating } = usePrestatarios();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Prestatario | null>(null);
    const [editing, setEditing] = useState<Prestatario | null>(null);
    const [form, setForm] = useState<PrestatarioCreate>({
        nombre: '', telefono: '', dependencia: '', cedula: '', email: '',
    });
    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar prestatarios</h3>
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
        setForm({ nombre: '', telefono: '', dependencia: '', cedula: '', email: '' });
        setModalOpen(true);
    };

    const openEdit = (item: Prestatario) => {
        setEditing(item);
        setForm({
            nombre: item.nombre, telefono: item.telefono || '',
            dependencia: item.dependencia, cedula: item.cedula || '',
            email: item.email || '',
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await updatePrestatario({ id: editing.id, data: form });
                toast('Actualizado', 'success');
            } else {
                await createPrestatario(form);
                toast('Creado', 'success');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deletePrestatario(deleteModal.id);
            toast('Inactivado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const filtered = items.filter((e) =>
        (e.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.dependencia || '').toLowerCase().includes(search.toLowerCase()),
    );

    const columns = [
        {
            key: 'nombre',
            header: 'Nombre',
            render: (e: Prestatario) => <span className="font-bold text-[#1a1f1c] dark:text-[#fdfdfd]">{e.nombre}</span>
        },
        { key: 'cedula', header: 'Cédula', className: 'font-mono text-muted-foreground dark:text-[#7b7b8b]', render: (e: Prestatario) => e.cedula || '-' },
        { key: 'dependencia', header: 'Dependencia', render: (e: Prestatario) => <span className="font-semibold dark:text-[#dddeff]">{e.dependencia}</span> },
        { key: 'telefono', header: 'Teléfono', className: 'text-muted-foreground dark:text-[#7b7b8b]', render: (e: Prestatario) => e.telefono || '-' },
        { key: 'email', header: 'Email', className: 'text-muted-foreground dark:text-[#7b7b8b]', render: (e: Prestatario) => e.email || '-' },
        {
            key: 'activo', header: 'Estado',
            render: (e: Prestatario) => (
                <Badge variant={e.activo ? 'success' : 'secondary'}>
                    {e.activo ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
        ...(canEdit ? [{
            key: 'actions', header: '', className: 'w-24 text-right',
            render: (e: Prestatario) => (
                <div className="flex justify-end gap-2 pr-4">
                    <button className="text-muted-foreground dark:text-[#7b7b8b] hover:text-[#415A52] dark:hover:text-[#5a62b8] transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}>
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground dark:text-[#7b7b8b] hover:text-destructive transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(e); }}>
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        }] : []),
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        placeholder="Buscar prestatarios..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 pl-12 pr-4 text-sm dark:text-[#fdfdfd] placeholder:text-muted-foreground dark:placeholder:text-[#7b7b8b] transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] dark:focus:ring-[#3b438e]/50 focus:border-[#415A52] dark:focus:border-[#3b438e]"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-12 px-5 rounded-2xl bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 text-[#1a1f1c] dark:text-[#fdfdfd] font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#3b438e]/50 transition-colors">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                    <button className="h-12 px-5 rounded-2xl bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 text-[#1a1f1c] dark:text-[#fdfdfd] font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#3b438e]/50 transition-colors">
                        <Download className="h-4 w-4" /> Export
                    </button>
                    {canEdit && (
                        <Button onClick={openCreate} className="h-12 px-6 rounded-2xl gap-2 font-bold shadow-md dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]">
                            <Plus className="h-4 w-4" /> Nuevo Prestatario
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <Table columns={columns} data={filtered} loading={isLoading} />
            </div>

            {/* Modals */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Prestatario' : 'Nuevo Prestatario'}>
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                        <Input label="Cédula" value={form.cedula || ''} onChange={(e) => setForm({ ...form, cedula: e.target.value })} />
                    </div>
                    <Input label="Dependencia" value={form.dependencia} onChange={(e) => setForm({ ...form, dependencia: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Teléfono" value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                        <Input label="Email" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setModalOpen(false)} className="dark:text-[#dddeff] dark:hover:bg-[#292a69]">Cancelar</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating} className="px-8 dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]">
                            {editing ? (isUpdating ? <Spinner size="sm" /> : 'Guardar') : (isCreating ? <Spinner size="sm" /> : 'Crear')}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar Inactivación">
                <div className="pt-2">
                    <p className="text-sm text-muted-foreground dark:text-[#7b7b8b] mb-6 leading-relaxed">¿Inactivar a <strong className="text-foreground dark:text-[#fdfdfd]">{deleteModal?.nombre}</strong>? El usuario ya no podrá recibir préstamos.</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeleteModal(null)} className="dark:text-[#dddeff] dark:hover:bg-[#292a69]">Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} className="px-8">Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
