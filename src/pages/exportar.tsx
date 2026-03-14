import { useState } from 'react';
import { Download, FileJson, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import { getErrorMessage } from '@/utils/error-handler';
import * as exportService from '@/services/export';

export default function ExportarPage() {
    const [loadingJSON, setLoadingJSON] = useState(false);
    const [loadingResumen, setLoadingResumen] = useState(false);
    const [successJSON, setSuccessJSON] = useState(false);
    const [successResumen, setSuccessResumen] = useState(false);
    const { toast } = useToast();

    const handleExportJSON = async () => {
        setLoadingJSON(true);
        setSuccessJSON(false);
        try {
            const data = await exportService.exportJSON();
            const fecha = new Date().toISOString().split('T')[0];
            exportService.downloadJSON(data, `backup_inventario_${fecha}.json`);
            setSuccessJSON(true);
            toast('Backup descargado exitosamente', 'success');
            setTimeout(() => setSuccessJSON(false), 3000);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        } finally {
            setLoadingJSON(false);
        }
    };

    const handleExportResumen = async () => {
        setLoadingResumen(true);
        setSuccessResumen(false);
        try {
            const data = await exportService.exportResumen();
            const fecha = new Date().toISOString().split('T')[0];
            exportService.downloadJSON(data, `resumen_inventario_${fecha}.json`);
            setSuccessResumen(true);
            toast('Resumen descargado exitosamente', 'success');
            setTimeout(() => setSuccessResumen(false), 3000);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        } finally {
            setLoadingResumen(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Exportar Datos
                </h2>
                <p className="text-sm text-muted-foreground">
                    Descarga backups del inventario completo o un resumen consolidado.
                </p>
            </div>

            {/* Export Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Backup */}
                <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FileJson className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Backup Completo</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Exporta todos los datos del inventario: equipos, electrónica, robots, materiales, prestatarios, préstamos y movimientos.
                        </p>
                    </div>
                    <Button
                        onClick={handleExportJSON}
                        disabled={loadingJSON}
                        className="w-full"
                    >
                        {loadingJSON ? (
                            <Spinner size="sm" />
                        ) : successJSON ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Descargado
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                Descargar JSON
                            </>
                        )}
                    </Button>
                </div>

                {/* Summary */}
                <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Resumen</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Exporta un resumen consolidado con totales, estadísticas y estado general del inventario.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleExportResumen}
                        disabled={loadingResumen}
                        className="w-full"
                    >
                        {loadingResumen ? (
                            <Spinner size="sm" />
                        ) : successResumen ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Descargado
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                Descargar Resumen
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Info */}
            <div className="rounded-xl bg-muted/50 border px-4 py-3 text-xs text-muted-foreground">
                💡 Los archivos se descargan en formato JSON. Guárdalos en un lugar seguro como respaldo del inventario.
            </div>
        </div>
    );
}
