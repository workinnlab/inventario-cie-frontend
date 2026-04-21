import { useState } from 'react';
import { Search, History, ArrowUpRight, ArrowDownLeft, RefreshCcw, AlertTriangle, Trash2, ArrowRightLeft, Filter, Download } from 'lucide-react';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMovimientos } from '@/hooks/use-movimientos';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobots } from '@/hooks/use-robots';
import { useMateriales } from '@/hooks/use-materiales';
import { formatDate } from '@/utils/formatters';
import type { Movimiento } from '@/types';

const tipoIcons: Record<string, any> = {
    entrada: <ArrowDownLeft className="h-4 w-4 text-emerald-500" />,
    salida: <ArrowUpRight className="h-4 w-4 text-amber-500" />,
    devolucion: <RefreshCcw className="h-4 w-4 text-blue-500" />,
    daño: <AlertTriangle className="h-4 w-4 text-red-500" />,
    ajuste_stock: <History className="h-4 w-4 text-gray-500" />,
    baja: <Trash2 className="h-4 w-4 text-red-500" />,
    transferencia: <ArrowRightLeft className="h-4 w-4 text-indigo-500" />,
};

export default function MovimientosPage() {
    const { movimientos, isLoading, isError, error } = useMovimientos();
    const { equipos } = useEquipos();
    const { electronica } = useElectronica();
    const { robots } = useRobots();
    const { materiales } = useMateriales();

    const [search, setSearch] = useState('');
    const [userFilter, setUserFilter] = useState<string>('');

    const uniqueUsers = [...new Set(movimientos.map(m => m.usuario_nombre).filter(Boolean))];

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar movimientos</h3>
                    <p className="text-sm text-muted-foreground">{error?.message || 'No se pudo conectar con el servidor'}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
                    Intentar de nuevo
                </Button>
            </div>
        );
    }

    const getItemName = (m: Movimiento) => {
        if (m.equipo_id) return equipos.find(e => e.id === m.equipo_id)?.nombre || `Equipo #${m.equipo_id}`;
        if (m.electronica_id) return electronica.find(e => e.id === m.electronica_id)?.nombre || `Electrónica #${m.electronica_id}`;
        if (m.robot_id) return robots.find(e => e.id === m.robot_id)?.nombre || `Robot #${m.robot_id}`;
        if (m.material_id) return materiales.find(e => e.id === m.material_id)?.color || `Material #${m.material_id}`;
        return 'N/A';
    };

    const filtered = movimientos.filter((m) => {
        const itemName = (getItemName(m) || '').toLowerCase();
        const description = (m.descripcion || '').toLowerCase();
        const type = (m.tipo || '').toLowerCase();
        const query = search.toLowerCase();
        const matchesUser = userFilter === '' || m.usuario_nombre === userFilter;

        return matchesUser && (itemName.includes(query) || description.includes(query) || type.includes(query));
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const columns = [
        { key: 'id', header: 'ID', className: 'w-16 font-mono text-muted-foreground' },
        {
            key: 'tipo',
            header: 'Tipo de Mov.',
            render: (m: Movimiento) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-[#292a69] flex items-center justify-center border border-gray-100 dark:border-[#3b438e]">
                        {tipoIcons[m.tipo]}
                    </div>
                    <span className="capitalize font-semibold text-[#1a1f1c] dark:text-[#fdfdfd]">{m.tipo.replace('_', ' ')}</span>
                </div>
            )
        },
        { key: 'item', header: 'Ítem Afectado', render: (m: Movimiento) => <span className="font-medium dark:text-[#dddeff]">{getItemName(m)}</span> },
        { key: 'descripcion', header: 'Descripción', className: 'max-w-xs truncate text-muted-foreground dark:text-[#7b7b8b]' },
        { key: 'cantidad', header: 'Cantidad', className: 'text-center', render: (m: Movimiento) => <Badge variant={m.cantidad > 0 ? 'success' : 'secondary'}>{m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}</Badge> },
        { key: 'usuario', header: 'Usuario', className: 'text-muted-foreground dark:text-[#7b7b8b]', render: (m: Movimiento) => <span className="font-medium">{m.usuario_nombre || '-'}</span> },
        { key: 'fecha', header: 'Fecha', className: 'text-muted-foreground dark:text-[#7b7b8b]', render: (m: Movimiento) => formatDate(m.created_at) },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Movimientos</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Historial de entradas, salidas y ajustes del inventario.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="h-12 px-4 rounded-full bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 border border-transparent dark:border-[#3b438e] text-sm font-medium dark:text-[#fdfdfd] focus:outline-none focus:ring-2 focus:ring-[#4f645b]/50"
                    >
                        <option value="">Todos los usuarios</option>
                        {uniqueUsers.map(user => (
                            <option key={user} value={user}>{user}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        placeholder="Filtrar historial de movimientos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-transparent bg-white dark:bg-[#292a69] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/30 pl-12 pr-4 text-sm dark:text-[#fdfdfd] placeholder:text-muted-foreground dark:placeholder:text-[#7b7b8b] transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] dark:focus:ring-[#3b438e]/50 focus:border-[#4f645b] dark:focus:border-[#3b438e]"
                    />
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <Table columns={columns} data={filtered} loading={isLoading} emptyMessage="No se registran movimientos" />
            </div>
        </div>
    );
}
