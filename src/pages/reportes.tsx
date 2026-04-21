import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import * as exportService from '@/services/export';

export default function ReportesPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const { toast } = useToast();

    const handleExportJSON = async () => {
        setLoading('json');
        try {
            const data = await exportService.exportJSON();
            exportService.downloadJSON(data, `backup_inventario_${new Date().toISOString().split('T')[0]}.json`);
            toast('Exportación completada', 'success');
        } catch (err: any) {
            toast('Error al exportar: ' + (err.response?.data?.detail || err.message), 'error');
        } finally {
            setLoading(null);
        }
    };

    const handleExportResumen = async () => {
        setLoading('resumen');
        try {
            const data = await exportService.exportResumen();
            exportService.downloadJSON(data, `resumen_inventario_${new Date().toISOString().split('T')[0]}.json`);
            toast('Resumen exportado', 'success');
        } catch (err: any) {
            toast('Error al exportar: ' + (err.response?.data?.detail || err.message), 'error');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Reportes</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Exporta y genera reportes del inventario.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#d1e8dd] dark:bg-[#3b438e]/30 p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#42564e] dark:text-[#9fb3ff] uppercase tracking-widest mb-2">Exportar</p>
                    <p className="text-2xl font-black text-[#2f433c] dark:text-[#9fb3ff]">JSON</p>
                    <p className="text-xs text-[#42564e]/70 dark:text-[#dddeff]/70 mt-1">Copia de seguridad completa</p>
                </div>
                <div className="bg-[#cae6fe] dark:bg-[#3b438e]/30 p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#3a5569] dark:text-[#9fb3ff] uppercase tracking-widest mb-2">Exportar</p>
                    <p className="text-2xl font-black text-[#274255] dark:text-[#9fb3ff]">Resumen</p>
                    <p className="text-xs text-[#3a5569]/70 dark:text-[#dddeff]/70 mt-1">Estadísticas generales</p>
                </div>
                <div className="bg-[#dcedff] dark:bg-[#3b438e]/30 p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#495867] dark:text-[#9fb3ff] uppercase tracking-widest mb-2">Exportar</p>
                    <p className="text-2xl font-black text-[#374655] dark:text-[#9fb3ff]">Excel</p>
                    <p className="text-xs text-[#495867]/70 dark:text-[#dddeff]/70 mt-1">Formato para hojas de cálculo</p>
                </div>
                <div className="bg-[#fa746f]/20 dark:bg-[#e53f67]/20 p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#6e0a12] dark:text-[#ff9fb3] uppercase tracking-widest mb-2">Reportes</p>
                    <p className="text-2xl font-black text-[#a83836] dark:text-[#ff9fb3]">Personalizado</p>
                    <p className="text-xs text-[#6e0a12]/70 dark:text-[#ffccd5]/70 mt-1">Genera reportes a medida</p>
                </div>
            </div>

            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* JSON Export */}
                <div className="bg-white dark:bg-[#22214d] p-8 rounded-2xl shadow-sm dark:shadow-black/30 border border-gray-100/50 dark:border-[#292a69]/50 hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-xl bg-[#4f645b] dark:bg-[#3b438e] text-white flex items-center justify-center mb-6">
                        <FileJson className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d3335] dark:text-[#fdfdfd] mb-2">Backup Completo</h3>
                    <p className="text-[#5a6062] dark:text-[#dddeff] text-sm mb-6">
                        Exporta todos los datos del sistema en formato JSON. Incluye equipos, electrónica, robótica, materiales y préstamos.
                    </p>
                    <Button
                        onClick={handleExportJSON}
                        disabled={loading === 'json'}
                        className="w-full h-12 rounded-xl font-semibold gap-2 dark:bg-[#3b438e] dark:hover:bg-[#5a62b8]"
                    >
                        {loading === 'json' ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Descargar JSON
                    </Button>
                </div>

                {/* Resumen Export */}
                <div className="bg-white dark:bg-[#22214d] p-8 rounded-2xl shadow-sm dark:shadow-black/30 border border-gray-100/50 dark:border-[#292a69]/50 hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-xl bg-[#486277] dark:bg-[#5a62b8] text-white flex items-center justify-center mb-6">
                        <FileSpreadsheet className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d3335] dark:text-[#fdfdfd] mb-2">Resumen Ejecutivo</h3>
                    <p className="text-[#5a6062] dark:text-[#dddeff] text-sm mb-6">
                        Exporta un resumen con estadísticas generales del inventario. Ideal para presentaciones y reportes administrativos.
                    </p>
                    <Button
                        onClick={handleExportResumen}
                        disabled={loading === 'resumen'}
                        variant="outline"
                        className="w-full h-12 rounded-xl font-semibold gap-2 dark:border-[#292a69] dark:text-[#dddeff] dark:hover:bg-[#292a69]"
                    >
                        {loading === 'resumen' ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4f645b] dark:border-[#3b438e] border-t-transparent" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Descargar Resumen
                    </Button>
                </div>

                {/* Print Report */}
                <div className="bg-white dark:bg-[#22214d] p-8 rounded-2xl shadow-sm dark:shadow-black/30 border border-gray-100/50 dark:border-[#292a69]/50 hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-xl bg-[#516170] dark:bg-[#5a62b8] text-white flex items-center justify-center mb-6">
                        <Printer className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d3335] dark:text-[#fdfdfd] mb-2">Imprimir Reporte</h3>
                    <p className="text-[#5a6062] dark:text-[#dddeff] text-sm mb-6">
                        Genera un reporte imprimible del estado actual del inventario. Incluye gráficos y estadísticas.
                    </p>
                    <Button
                        onClick={() => window.print()}
                        variant="outline"
                        className="w-full h-12 rounded-xl font-semibold gap-2 dark:border-[#292a69] dark:text-[#dddeff] dark:hover:bg-[#292a69]"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                </div>
            </div>
        </div>
    );
}
