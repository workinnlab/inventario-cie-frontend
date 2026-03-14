import { useEffect, useState } from 'react';
import { AlertOctagon, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import * as equiposService from '@/services/equipos';
import type { Equipo } from '@/types';

export function AlertasEquipos() {
    const [danados, setDanados] = useState<Equipo[]>([]);
    const [mantenimiento, setMantenimiento] = useState<Equipo[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedDanados, setExpandedDanados] = useState(false);
    const [expandedMantenimiento, setExpandedMantenimiento] = useState(false);

    useEffect(() => {
        async function loadEquipos() {
            try {
                const [danadosData, mantenimientoData] = await Promise.all([
                    equiposService.getByEstado('dañado'),
                    equiposService.getByEstado('mantenimiento'),
                ]);
                setDanados(danadosData);
                setMantenimiento(mantenimientoData);
            } catch (err) {
                console.error('Error cargando alertas de equipos:', err);
            } finally {
                setLoading(false);
            }
        }
        loadEquipos();
    }, []);

    if (loading || (danados.length === 0 && mantenimiento.length === 0)) return null;

    return (
        <div className="space-y-3">
            {/* Damaged Equipments - Red */}
            {danados.length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 animate-fade-in">
                    <button
                        onClick={() => setExpandedDanados(!expandedDanados)}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
                                <AlertOctagon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-destructive text-sm">
                                    Equipos Dañados
                                </h3>
                                <p className="text-xs text-destructive/70">
                                    {danados.length} equipo{danados.length > 1 ? 's' : ''} reportado{danados.length > 1 ? 's' : ''} como dañado{danados.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-2">
                                {danados.length}
                            </span>
                            {expandedDanados ? <ChevronUp className="h-4 w-4 text-destructive/50" /> : <ChevronDown className="h-4 w-4 text-destructive/50" />}
                        </div>
                    </button>

                    {expandedDanados && (
                        <div className="mt-3 space-y-1.5 pl-12">
                            {danados.map((e) => (
                                <div key={e.id} className="flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2 text-sm">
                                    <span className="text-destructive font-medium">{e.nombre}</span>
                                    <span className="text-xs text-destructive/70 font-mono">{e.codigo} — {e.marca}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* In Maintenance - Blue */}
            {mantenimiento.length > 0 && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 animate-fade-in">
                    <button
                        onClick={() => setExpandedMantenimiento(!expandedMantenimiento)}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                <Wrench className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-primary text-sm">
                                    En Mantenimiento
                                </h3>
                                <p className="text-xs text-primary/70">
                                    {mantenimiento.length} equipo{mantenimiento.length > 1 ? 's' : ''} en mantenimiento
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold px-2">
                                {mantenimiento.length}
                            </span>
                            {expandedMantenimiento ? <ChevronUp className="h-4 w-4 text-primary/50" /> : <ChevronDown className="h-4 w-4 text-primary/50" />}
                        </div>
                    </button>

                    {expandedMantenimiento && (
                        <div className="mt-3 space-y-1.5 pl-12">
                            {mantenimiento.map((e) => (
                                <div key={e.id} className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm">
                                    <span className="text-foreground font-medium">{e.nombre}</span>
                                    <span className="text-xs text-muted-foreground font-mono">{e.codigo}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
