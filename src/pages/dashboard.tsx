import { useEffect, useState } from 'react';
import { Monitor, Cpu, Bot, Package, ClipboardList, History as HistoryIcon, AlertTriangle, CheckCircle, RotateCw, Send, XCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { Badge, getEstadoBadgeVariant } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobots } from '@/hooks/use-robots';
import { useMateriales } from '@/hooks/use-materiales';
import { usePrestamos } from '@/hooks/use-prestamos';
import { useMovimientos } from '@/hooks/use-movimientos';
import { formatDateTime } from '@/utils/formatters';
import { AlertasPrestamos } from '@/components/alerts/AlertasPrestamos';
import { AlertasStock } from '@/components/alerts/AlertasStock';
import { AlertasEquipos } from '@/components/alerts/AlertasEquipos';
import * as dashboardService from '@/services/dashboard';
import type { DashboardResumen } from '@/services/dashboard';


export default function DashboardPage() {
    const { equipos, isLoading: loadingEquipos, isError: errorEquipos } = useEquipos();
    const { electronica, isLoading: loadingElectronica, isError: errorElectronica } = useElectronica();
    const { robots, isLoading: loadingRobots, isError: errorRobots } = useRobots();
    const { materiales, isLoading: loadingMateriales, isError: errorMateriales } = useMateriales();
    const { prestamosActivos, isLoading: loadingPrestamos, isError: errorPrestamos } = usePrestamos();
    const { movimientos, isLoading: loadingMovimientos, isError: errorMovimientos } = useMovimientos();

    const [resumen, setResumen] = useState<DashboardResumen | null>(null);
    const [resumenLoading, setResumenLoading] = useState(true);

    useEffect(() => {
        async function loadResumen() {
            try {
                const data = await dashboardService.getResumen();
                setResumen(data);
            } catch (err) {
                console.error('Error cargando resumen del dashboard:', err);
            } finally {
                setResumenLoading(false);
            }
        }
        loadResumen();
    }, []);

    const loading = loadingEquipos || loadingElectronica || loadingRobots || loadingMateriales || loadingPrestamos || loadingMovimientos;

    const hasPartialError = errorEquipos || errorElectronica || errorRobots || errorMateriales || errorPrestamos || errorMovimientos;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Alerts Section ── */}
            <section className="space-y-3">
                <AlertasPrestamos />
                <AlertasStock />
                <AlertasEquipos />
            </section>

            {/* ── Partial Error Banner ── */}
            {hasPartialError && (
                <div className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2 text-sm text-warning">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Algunos datos no se pudieron cargar. Los datos mostrados podrían estar incompletos.</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Reintentar
                    </Button>
                </div>
            )}

            {/* ── Stats Grid ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Equipos"
                    value={resumen?.totales?.equipos ?? equipos.length}
                    icon={<Monitor className="h-5 w-5" />}
                />
                <StatCard
                    title="Electrónica"
                    value={resumen?.totales?.electronica ?? electronica.length}
                    icon={<Cpu className="h-5 w-5" />}
                />
                <StatCard
                    title="Robots"
                    value={resumen?.totales?.robots ?? robots.length}
                    icon={<Bot className="h-5 w-5" />}
                />
                <StatCard
                    title="Materiales"
                    value={resumen?.totales?.materiales ?? materiales.length}
                    icon={<Package className="h-5 w-5" />}
                />
            </div>

            {/* ── Equipment & Loans by Status ── */}
            {resumen && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Equipos por Estado */}
                    <div className="rounded-xl border bg-card p-5 space-y-3">
                        <h2 className="font-semibold flex items-center gap-2 text-sm">
                            <Monitor className="h-4 w-4 text-primary" />
                            Equipos por Estado
                        </h2>
                        <div className="space-y-2">
                            {[
                                { label: 'Disponibles', value: resumen.equipos.disponibles, icon: <CheckCircle className="h-3.5 w-3.5" />, color: 'text-success' },
                                { label: 'En Uso', value: resumen.equipos.en_uso, icon: <RotateCw className="h-3.5 w-3.5" />, color: 'text-primary' },
                                { label: 'Prestados', value: resumen.equipos.prestados, icon: <Send className="h-3.5 w-3.5" />, color: 'text-warning' },
                                { label: 'Dañados', value: resumen.equipos.danados, icon: <XCircle className="h-3.5 w-3.5" />, color: 'text-destructive' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                                    <div className={`flex items-center gap-2 text-sm ${item.color}`}>
                                        {item.icon}
                                        <span className="text-foreground">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Préstamos por Estado */}
                    <div className="rounded-xl border bg-card p-5 space-y-3">
                        <h2 className="font-semibold flex items-center gap-2 text-sm">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            Préstamos por Estado
                        </h2>
                        <div className="space-y-2">
                            {[
                                { label: 'Activos', value: resumen.prestamos.activos, variant: 'success' as const },
                                { label: 'Devueltos', value: resumen.prestamos.devueltos, variant: 'secondary' as const },
                                { label: 'Vencidos', value: resumen.prestamos.vencidos, variant: 'destructive' as const },
                                { label: 'Por Vencer (7 días)', value: resumen.prestamos.por_vencer_7_dias, variant: 'warning' as const },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                                    <span className="text-sm">{item.label}</span>
                                    <Badge variant={item.variant}>{item.value}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Active Loans & Recent Movements ── */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Active Loans */}
                <div className="rounded-xl border bg-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            Préstamos Activos
                        </h2>
                        <Badge variant="warning">{prestamosActivos.length}</Badge>
                    </div>
                    {prestamosActivos.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No hay préstamos activos</p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {prestamosActivos.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                                    <span>Préstamo #{p.id}</span>
                                    <Badge variant={getEstadoBadgeVariant(p.estado)}>{p.estado}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Movements */}
                <div className="rounded-xl border bg-card p-5 space-y-4">
                    <h2 className="font-semibold flex items-center gap-2">
                        <HistoryIcon className="h-4 w-4 text-primary" />
                        Movimientos Recientes
                    </h2>

                    {movimientos.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No hay movimientos recientes</p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {movimientos.slice(0, 5).map((m) => (

                                <div key={m.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                                    <div>
                                        <span className="font-medium capitalize">{m.tipo}</span>
                                        {m.descripcion && (
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{m.descripcion}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDateTime(m.created_at)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
