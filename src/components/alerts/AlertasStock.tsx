import { useEffect, useState } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import * as materialesService from '@/services/materiales';
import type { Material } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function AlertasStock() {
    const [stockBajo, setStockBajo] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadStock() {
            try {
                const data = await materialesService.getStockMinimo(5);
                setStockBajo(data);
            } catch (err) {
                console.error('Error cargando alertas de stock:', err);
            } finally {
                setLoading(false);
            }
        }
        loadStock();
    }, []);

    if (loading || stockBajo.length === 0) return null;

    return (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 animate-fade-in">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
                        <Package className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-warning text-sm">
                            Stock Bajo
                        </h3>
                        <p className="text-xs text-warning/70">
                            {stockBajo.length} material{stockBajo.length > 1 ? 'es' : ''} con stock mínimo
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-warning text-warning-foreground text-xs font-bold px-2">
                        {stockBajo.length}
                    </span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-warning/50" /> : <ChevronDown className="h-4 w-4 text-warning/50" />}
                </div>
            </button>

            {expanded && (
                <div className="mt-3 pl-12 space-y-2">
                    <div className="rounded-lg overflow-hidden border border-warning/20">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-warning/10 text-warning">
                                    <th className="text-left px-3 py-1.5 font-medium text-xs">Material</th>
                                    <th className="text-left px-3 py-1.5 font-medium text-xs">Categoría</th>
                                    <th className="text-right px-3 py-1.5 font-medium text-xs">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockBajo.map((m) => (
                                    <tr key={m.id} className="border-t border-warning/10">
                                        <td className="px-3 py-1.5 text-foreground">{m.color} — {m.cantidad}</td>
                                        <td className="px-3 py-1.5 text-muted-foreground">{m.categoria}</td>
                                        <td className="px-3 py-1.5 text-right">
                                            <span className="inline-flex items-center justify-center rounded-full bg-destructive/15 text-destructive text-xs font-bold px-2 py-0.5 min-w-6">
                                                {m.en_stock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/materiales')}
                        className="text-xs"
                    >
                        Ver todos los materiales →
                    </Button>
                </div>
            )}
        </div>
    );
}
