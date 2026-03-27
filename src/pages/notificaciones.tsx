import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bell, Search, Filter, AlertTriangle, CheckCircle, Check, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notificacion {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: 'warning' | 'error' | 'success';
    leida: boolean;
    ruta: string;
    fecha: string;
}

const notificacionesInitial: Notificacion[] = [
    { id: 1, titulo: 'Préstamo por vencer', descripcion: 'El préstamo #123 vence mañana', tipo: 'warning', leida: false, ruta: '/prestamos?tab=vencidos', fecha: '2026-03-27T10:00:00Z' },
    { id: 2, titulo: 'Stock bajo', descripcion: 'Filamento PLA Blanco tiene stock bajo', tipo: 'error', leida: false, ruta: '/materiales', fecha: '2026-03-27T09:30:00Z' },
    { id: 3, titulo: 'Préstamo devuelto', descripcion: 'El equipo MacBook Pro fue devuelto', tipo: 'success', leida: true, ruta: '/prestamos', fecha: '2026-03-26T15:00:00Z' },
    { id: 4, titulo: 'Equipo dañado', descripcion: 'Se reportó un equipo como dañado', tipo: 'error', leida: false, ruta: '/danados', fecha: '2026-03-26T14:00:00Z' },
    { id: 5, titulo: 'Nuevo préstamo', descripcion: 'Se registró un nuevo préstamo', tipo: 'success', leida: false, ruta: '/prestamos', fecha: '2026-03-26T10:00:00Z' },
    { id: 6, titulo: 'Mantenimiento programado', descripcion: 'El equipo #45 requiere mantenimiento', tipo: 'warning', leida: true, ruta: '/equipos', fecha: '2026-03-25T11:00:00Z' },
    { id: 7, titulo: 'Stock agotado', descripcion: 'Filamento PLA Negro se agotó', tipo: 'error', leida: true, ruta: '/materiales', fecha: '2026-03-25T09:00:00Z' },
];

type FiltroNotificaciones = 'todas' | 'no_leidas' | 'leidas';

export default function NotificacionesPage() {
    const [searchParams] = useSearchParams();
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesInitial);
    const [search, setSearch] = useState('');
    const [filtro, setFiltro] = useState<FiltroNotificaciones>('todas');

    const filtered = notificaciones.filter(n => {
        const matchesSearch = n.titulo.toLowerCase().includes(search.toLowerCase()) ||
            n.descripcion.toLowerCase().includes(search.toLowerCase());
        
        if (!matchesSearch) return false;
        
        if (filtro === 'no_leidas') return !n.leida;
        if (filtro === 'leidas') return n.leida;
        return true;
    });

    const noLeidas = notificaciones.filter(n => !n.leida).length;
    const leidas = notificaciones.filter(n => n.leida).length;

    const toggleLeida = (id: number) => {
        setNotificaciones(prev => prev.map(n =>
            n.id === id ? { ...n, leida: !n.leida } : n
        ));
    };

    const eliminarNotificacion = (id: number) => {
        setNotificaciones(prev => prev.filter(n => n.id !== id));
    };

    const marcarTodasLeidas = () => {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
            case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
            default: return <Bell className="h-5 w-5" />;
        }
    };

    const getTipoBadge = (tipo: string) => {
        switch (tipo) {
            case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return '';
        }
    };

    const formatFecha = (fecha: string) => {
        const d = new Date(fecha);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const horas = Math.floor(diff / (1000 * 60 * 60));
        
        if (horas < 1) return 'Hace un momento';
        if (horas < 24) return `Hace ${horas}h`;
        const dias = Math.floor(horas / 24);
        if (dias === 1) return 'Ayer';
        if (dias < 7) return `Hace ${dias} días`;
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#2d3335] dark:text-white">Notificaciones</h1>
                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                        {noLeidas > 0 ? `Tienes ${noLeidas} notificaciones sin leer` : 'No tienes notificaciones sin leer'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {noLeidas > 0 && (
                        <Button variant="outline" onClick={marcarTodasLeidas}>
                            <Check className="h-4 w-4 mr-2" />
                            Marcar todo como leído
                        </Button>
                    )}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar notificaciones..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filtro === 'todas' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setFiltro('todas')}
                    >
                        Todas ({notificaciones.length})
                    </Button>
                    <Button
                        variant={filtro === 'no_leidas' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setFiltro('no_leidas')}
                    >
                        No leídas ({noLeidas})
                    </Button>
                    <Button
                        variant={filtro === 'leidas' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setFiltro('leidas')}
                    >
                        Leídas ({leidas})
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold text-[#2d3335] dark:text-white mb-2">
                            No hay notificaciones
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {search ? 'No se encontraron notificaciones con ese criterio' : 'No tienes notificaciones en esta categoría'}
                        </p>
                    </Card>
                ) : (
                    filtered.map((notif) => (
                        <Card
                            key={notif.id}
                            className={`p-4 transition-all hover:shadow-md ${
                                !notif.leida ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400' : ''
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${getTipoBadge(notif.tipo)}`}>
                                    {getTipoIcon(notif.tipo)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-semibold ${notif.leida ? 'text-muted-foreground' : 'text-[#2d3335] dark:text-white'}`}>
                                                    {notif.titulo}
                                                </h3>
                                                {!notif.leida && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0"></span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground dark:text-slate-400 mt-1">
                                                {notif.descripcion}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-2">
                                                {formatFecha(notif.fecha)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleLeida(notif.id)}
                                                title={notif.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                                            >
                                                {notif.leida ? (
                                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => eliminarNotificacion(notif.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                            <Link to={notif.ruta}>
                                                <Button variant="ghost" size="icon">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                <span>Total: {filtered.length} notificaciones</span>
                <span>No leídas: {noLeidas} | Leídas: {leidas}</span>
            </div>
        </div>
    );
}