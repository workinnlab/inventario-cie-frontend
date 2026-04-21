import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useRobots } from '@/hooks/use-robots';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Robot, RobotCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';

export default function RobotsPage() {
    const { robots: items, isLoading, isError, error, createRobot, updateRobot, deleteRobot, isCreating, isUpdating } = useRobots();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Robot | null>(null);
    const [editing, setEditing] = useState<Robot | null>(null);
    const [form, setForm] = useState<RobotCreate>({ nombre: '', fuera_de_servicio: 0, en_uso: 0, disponible: 0 });
    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

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

    const openCreate = () => { setEditing(null); setForm({ nombre: '', fuera_de_servicio: 0, en_uso: 0, disponible: 0 }); setModalOpen(true); };
    const openEdit = (item: Robot) => { setEditing(item); setForm({ nombre: item.nombre, fuera_de_servicio: item.fuera_de_servicio, en_uso: item.en_uso, disponible: item.disponible }); setModalOpen(true); };

    const handleSave = async () => {
        try {
            if (editing) { await updateRobot({ id: editing.id, data: form }); toast('Actualizado', 'success'); }
            else { await createRobot(form); toast('Creado', 'success'); }
            setModalOpen(false);
        } catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try { await deleteRobot(deleteModal.id); toast('Eliminado', 'success'); setDeleteModal(null); }
        catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };

    const filtered = items.filter(e => (e.nombre || '').toLowerCase().includes(search.toLowerCase())).sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

    const columns: any = [
        {
            key: 'nombre',
            header: 'Nombre',
            render: (e: Robot) => <span className="font-bold text-[#1a1f1c] dark:text-[#fdfdfd]">{e.nombre}</span>
        },
        { key: 'disponible', header: 'Disponibles', render: (e: Robot) => <span className="font-semibold text-[#1a1f1c] dark:text-[#fdfdfd]">{e.disponible}</span> },
        { key: 'en_uso', header: 'En Uso', render: (e: Robot) => <span className="font-semibold text-muted-foreground dark:text-[#dddeff]">{e.en_uso}</span> },
        { key: 'fuera_de_servicio', header: 'Fuera Servicio', render: (e: Robot) => <span className="font-semibold text-destructive">{e.fuera_de_servicio}</span> },
        { key: 'total', header: 'Total', render: (e: Robot) => <span className="font-semibold text-muted-foreground dark:text-[#dddeff]">{e.disponible + e.en_uso + e.fuera_de_servicio}</span> },
        { key: 'created_at', header: 'Creado', className: 'text-muted-foreground dark:text-[#7b7b8b]', render: (e: Robot) => formatDate(e.created_at) },
        ...(canEdit ? [{
            key: 'actions', header: '', className: 'w-24 text-right', render: (e: Robot) => (
                <div className="flex justify-end gap-2 pr-4">
                    <button className="text-muted-foreground dark:text-[#7b7b8b] hover:text-[#415A52] dark:hover:text-[#5a62b8] transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}>
                        <Pencil className="h-4 w-4" />
                    </button>
                    {canDelete && (
                        <button className="text-muted-foreground dark:text-[#7b7b8b] hover:text-destructive transition-colors p-2" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(e); }}>
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )
        }] : []),
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Robots</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Gestiona el inventario de robots y kits de robótica.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <Button onClick={openCreate} className="h-12 px-6 rounded-full gap-2 font-bold shadow-md dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]">
                            <Plus className="h-4 w-4" /> Nuevo Robot
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        placeholder="Buscar robots..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 pl-12 pr-4 text-sm dark:text-[#fdfdfd] placeholder:text-muted-foreground dark:placeholder:text-[#7b7b8b] transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] dark:focus:ring-[#3b438e]/50 focus:border-[#415A52] dark:focus:border-[#3b438e]"
                    />
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <Table columns={columns} data={filtered} loading={isLoading} emptyMessage="No hay robots" />
            </div>

            {/* Modals */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar robot' : 'Nuevo robot'}>
                <div className="space-y-4 pt-2">
                    <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Disponibles" type="number" value={form.disponible} onChange={(e) => setForm({ ...form, disponible: +e.target.value })} />
                        <Input label="En Uso" type="number" value={form.en_uso} onChange={(e) => setForm({ ...form, en_uso: +e.target.value })} />
                        <Input label="Fuera Serv." type="number" value={form.fuera_de_servicio} onChange={(e) => setForm({ ...form, fuera_de_servicio: +e.target.value })} />
                    </div>
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
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">¿Eliminar <strong className="text-foreground">{deleteModal?.nombre}</strong>? Esta acción no se puede deshacer.</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} className="px-8">Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
