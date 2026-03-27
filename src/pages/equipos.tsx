import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Undo2, Trash2, Search, Filter, AlertTriangle, Monitor, Keyboard, Server, Armchair, Pencil, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useEquipos } from '@/hooks/use-equipos';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Equipo, EquipoCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';

const estadoOptionsAll = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'en uso', label: 'En uso' },
    { value: 'prestado', label: 'Prestado' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'dañado', label: 'Dañado' },
    { value: 'arreglado', label: 'Arreglado' },
];

// Estados que se pueden seleccionar manualmente (sin "prestado" que es automático)
const estadoOptionsEditable = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'en uso', label: 'En uso' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'dañado', label: 'Dañado' },
    { value: 'arreglado', label: 'Arreglado' },
];

const tabs = ['Todos', 'Disponibles', 'En Uso', 'Prestados', 'Mantenimiento', 'Dañados', 'Arreglados'];

const getIcon = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('laptop') || n.includes('macbook') || n.includes('dell') || n.includes('computadora')) return <Monitor className="h-5 w-5" />;
    if (n.includes('keyboard') || n.includes('mouse') || n.includes('teclado') || n.includes('audifono')) return <Keyboard className="h-5 w-5" />;
    if (n.includes('server') || n.includes('servidor')) return <Server className="h-5 w-5" />;
    if (n.includes('silla') || n.includes('mesa') || n.includes('escritorio')) return <Armchair className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
};

export default function EquiposPage() {
    const { equipos, isLoading, isError, error, createEquipo, updateEquipo, deleteEquipo, isCreating, isUpdating } = useEquipos();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(searchParams.get('new') === 'true');
    const [deleteModal, setDeleteModal] = useState<Equipo | null>(null);
    const [editing, setEditing] = useState<Equipo | null>(null);
    const [form, setForm] = useState<any>({
        nombre: '', marca: '', codigo: '', accesorios: '', serial: '', estado: 'disponible',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar equipos</h3>
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
        setForm({ nombre: '', marca: '', codigo: '', accesorios: '', serial: '', estado: 'disponible' });
        setModalOpen(true);
    };

    const openEdit = (equipo: Equipo) => {
        setEditing(equipo);
        setForm({ nombre: equipo.nombre, marca: equipo.marca, codigo: equipo.codigo, accesorios: equipo.accesorios || '', serial: equipo.serial || '', estado: equipo.estado });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            // Si el estado es "arreglado", cambiar automáticamente a "disponible"
            const estadoFinal = form.estado === 'arreglado' ? 'disponible' : form.estado;
            const dataToSave = { ...form, estado: estadoFinal };
            
            if (editing) {
                await updateEquipo({ id: editing.id, data: dataToSave });
                toast(estadoFinal === 'disponible' ? 'Equipo marcado como arreglado y disponible' : 'Equipo actualizado', 'success');
            } else {
                await createEquipo(dataToSave);
                toast('Equipo creado', 'success');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deleteEquipo(deleteModal.id);
            toast('Equipo eliminado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const filtered = equipos.filter((e) => {
        const matchesSearch = (e.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
            (e.codigo || '').toLowerCase().includes(search.toLowerCase()) ||
            (e.marca || '').toLowerCase().includes(search.toLowerCase());
        
        let matchesTab = true;
        if (activeTab === 'Disponibles') matchesTab = e.estado === 'disponible';
        else if (activeTab === 'En Uso') matchesTab = e.estado === 'en uso';
        else if (activeTab === 'Prestados') matchesTab = e.estado === 'prestado';
        else if (activeTab === 'Mantenimiento') matchesTab = e.estado === 'mantenimiento';
        else if (activeTab === 'Dañados') matchesTab = e.estado === 'dañado';
        else if (activeTab === 'Arreglados') matchesTab = e.estado === 'arreglado';
        
        return matchesSearch && matchesTab;
    });

    // Paginación
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    const getBadgeVariant = (estado: string) => {
        switch (estado) {
            case 'disponible': return 'success';
            case 'en uso': return 'warning';
            case 'prestado': return 'secondary';
            case 'mantenimiento': return 'warning';
            case 'dañado': return 'destructive';
            case 'arreglado': return 'success';
            default: return 'secondary';
        }
    };

    const columns: any = [
        { 
            key: 'codigo', 
            header: 'Código', 
            render: (e: Equipo) => (
                <span className="font-mono text-xs font-bold text-muted-foreground px-2 py-1 bg-[#ebeef0] rounded-md tracking-tighter">{e.codigo}</span>
            )
        },
        {
            key: 'nombre',
            header: 'Equipo / Nombre',
            render: (e: Equipo) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#dee3e6] flex items-center justify-center text-muted-foreground">
                        {getIcon(e.nombre)}
                    </div>
                    <div>
                        <p className="font-bold text-[#2d3335] leading-tight">{e.nombre}</p>
                        <p className="text-xs text-[#5a6062]">{e.serial || 'Sin serie'}</p>
                    </div>
                </div>
            )
        },
        { key: 'marca', header: 'Marca', render: (e: Equipo) => <span className="font-medium text-[#2d3335]">{e.marca}</span> },
        {
            key: 'estado',
            header: 'Estado',
            render: (e: Equipo) => (
                <Badge variant={getBadgeVariant(e.estado)}>
                    {e.estado.charAt(0).toUpperCase() + e.estado.slice(1)}
                </Badge>
            ),
        },
        ...(canEdit || canDelete ? [{
            key: 'actions',
            header: '',
            className: 'w-24 text-right',
            render: (e: Equipo) => (
                <div className="flex justify-end gap-2 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] tracking-tighter leading-none">Inventario General</h2>
                    <p className="text-[#5a6062] max-w-md">Gestiona y monitorea el estado actual de todos los activos tecnológicos de la organización.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-5 rounded-full gap-2 font-semibold">
                        <Filter className="h-4 w-4" /> Filtros Avanzados
                    </Button>
                    {canEdit && (
                        <Button onClick={openCreate} className="h-12 px-6 rounded-full gap-2 font-bold shadow-md">
                            <Plus className="h-4 w-4" /> Nuevo Equipo
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
                        placeholder="Buscar equipo..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] pl-12 pr-4 text-sm placeholder:text-muted-foreground transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] focus:border-[#4f645b]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-5 rounded-full gap-2 font-semibold">
                        <Download className="h-4 w-4" /> Exportar
                    </Button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                <Table columns={columns} data={paginatedData} loading={isLoading} emptyMessage="No se encontraron equipos" />

                {/* Pagination */}
                {!isLoading && filtered.length > 0 && (
                    <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between text-sm text-muted-foreground font-medium">
                        <span>Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} equipos</span>
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

            {/* Create/Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar equipo' : 'Nuevo equipo'}>
                <div className="space-y-4 pt-2">
                    <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <Input label="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required />
                    <Input label="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required />
                    <Input label="Serial" value={form.serial || ''} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
                    <Input label="Accesorios" value={form.accesorios || ''} onChange={(e) => setForm({ ...form, accesorios: e.target.value })} />
                    <Select
                        label="Estado"
                        value={form.estado}
                        onChange={(e) => setForm({ ...form, estado: e.target.value })}
                        options={estadoOptionsEditable}
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
                        ¿Estás seguro de eliminar <strong className="text-foreground">{deleteModal?.nombre}</strong> ({deleteModal?.codigo})? Esta acción no se puede deshacer.
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
