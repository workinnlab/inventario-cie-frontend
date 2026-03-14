import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import * as prestamosService from '@/services/prestamos';
import type { Prestamo } from '@/types';
import { formatDate } from '@/utils/formatters';

export function AlertasPrestamos() {
    const [porVencer, setPorVencer] = useState<Prestamo[]>([]);
    const [vencidos, setVencidos] = useState<Prestamo[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedVencidos, setExpandedVencidos] = useState(false);
    const [expandedPorVencer, setExpandedPorVencer] = useState(false);

    useEffect(() => {
        async function loadAlertas() {
            try {
                const [porVencerData, activosData] = await Promise.all([
                    prestamosService.getPorVencer(7),
                    prestamosService.getActivos(),
                ]);
                setPorVencer(porVencerData);
                const vencidosData = activosData.filter((p) => {
                    if (!p.fecha_limite) return false;
                    return new Date(p.fecha_limite) < new Date();
                });
                setVencidos(vencidosData);
            } catch (err) {
                console.error('Error cargando alertas de préstamos:', err);
            } finally {
                setLoading(false);
            }
        }
        loadAlertas();
    }, []);

    if (loading || (vencidos.length === 0 && porVencer.length === 0)) return null;

    return (
        <div className="space-y-3">
            {/* Overdue - Red Alert */}
            {vencidos.length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 animate-fade-in">
                    <button
                        onClick={() => setExpandedVencidos(!expandedVencidos)}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-destructive text-sm">
                                    Préstamos Vencidos
                                </h3>
                                <p className="text-xs text-destructive/70">
                                    {vencidos.length} préstamo{vencidos.length > 1 ? 's' : ''} requiere{vencidos.length > 1 ? 'n' : ''} atención inmediata
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-2">
                                {vencidos.length}
                            </span>
                            {expandedVencidos ? <ChevronUp className="h-4 w-4 text-destructive/50" /> : <ChevronDown className="h-4 w-4 text-destructive/50" />}
                        </div>
                    </button>

                    {expandedVencidos && (
                        <div className="mt-3 space-y-1.5 pl-12">
                            {vencidos.map((p) => (
                                <div key={p.id} className="flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2 text-sm">
                                    <span className="text-destructive font-medium">Préstamo #{p.id}</span>
                                    <span className="text-xs text-destructive/70">
                                        Venció: {p.fecha_limite ? formatDate(p.fecha_limite) : 'N/A'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Expiring Soon - Yellow Alert */}
            {porVencer.length > 0 && (
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 animate-fade-in">
                    <button
                        onClick={() => setExpandedPorVencer(!expandedPorVencer)}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-warning text-sm">
                                    Préstamos por Vencer
                                </h3>
                                <p className="text-xs text-warning/70">
                                    {porVencer.length} préstamo{porVencer.length > 1 ? 's' : ''} vence{porVencer.length > 1 ? 'n' : ''} en los próximos 7 días
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-warning text-warning-foreground text-xs font-bold px-2">
                                {porVencer.length}
                            </span>
                            {expandedPorVencer ? <ChevronUp className="h-4 w-4 text-warning/50" /> : <ChevronDown className="h-4 w-4 text-warning/50" />}
                        </div>
                    </button>

                    {expandedPorVencer && (
                        <div className="mt-3 space-y-1.5 pl-12">
                            {porVencer.map((p) => (
                                <div key={p.id} className="flex items-center justify-between rounded-lg bg-warning/10 px-3 py-2 text-sm">
                                    <span className="text-foreground font-medium">Préstamo #{p.id}</span>
                                    <span className="text-xs text-warning">
                                        Vence: {p.fecha_limite ? formatDate(p.fecha_limite) : 'N/A'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
