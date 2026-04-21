import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bell, Search, Filter, AlertTriangle, CheckCircle, Check, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useNotificaciones } from '@/hooks/use-notificaciones';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/utils/error-handler';

type FiltroNotificaciones = 'todas' | 'no_leidas' | 'leidas';

export default function NotificacionesPage() {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [filtro, setFiltro] = useState<FiltroNotificaciones>('todas');

    const {
        notificaciones,
        isLoading,
        isError,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotificacion,
        isMarkingAsRead,
        isMarkingAllAsRead,
        isDeleting,
    } = useNotificaciones();

    const handleToggleLeida = async (id: number) => {
        try {
            await markAsRead(id);
            toast('Notificación marcada como leída', 'success');
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleEliminar = async (id: number) => {
        try {
            await deleteNotificacion(id);
            toast('Notificación eliminada', 'success');
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleMarcarTodas = async () => {
        try {
            await markAllAsRead();
            toast('Todas las notificaciones marcadas como leídas', 'success');
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
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

    const filtered = notificaciones.filter(n => {
        const matchesSearch = n.titulo.toLowerCase().includes(search.toLowerCase()) ||
            (n.mensaje || '').toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (filtro === 'no_leidas') return !n.leida;
        if (filtro === 'leidas') return n.leida;
        return true;
    });

    const noLeidas = notificaciones.filter(n => !n.leida).length;
    const leidas = notificaciones.filter(n => n.leida).length;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar notificaciones</h3>
                    <p className="text-sm text-muted-foreground">{error?.message || 'No se pudo conectar con el servidor'}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
                    Intentar de nuevo
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

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
                        <Button variant="outline" onClick={handleMarcarTodas} disabled={isMarkingAllAsRead}>
                            <Check className="h-4 w-4 mr-2" />
                            {isMarkingAllAsRead ? 'Marcando...' : 'Marcar todo como leído'}
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
                                                {notif.mensaje}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-2">
                                                {formatFecha(notif.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleLeida(notif.id)}
                                                disabled={isMarkingAsRead}
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
                                                onClick={() => handleEliminar(notif.id)}
                                                disabled={isDeleting}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                            <Link to={notif.url || '#'}>
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