import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Wrench, TrendingUp, Monitor, Cpu, Bot, FolderOpen, ArrowRight, QrCode, CheckCircle, RefreshCcw, Send, XCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import * as dashboardService from '@/services/dashboard';
import type { DashboardResumen } from '@/services/dashboard';

export default function DashboardPage() {
    const [resumen, setResumen] = useState<DashboardResumen | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadResumen() {
            try {
                const data = await dashboardService.getResumen();
                setResumen(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        }
        loadResumen();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar el dashboard</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
                    Intentar de nuevo
                </Button>
            </div>
        );
    }

    const totalEquipos = resumen?.totales?.equipos || 0;
    const totalElectronica = resumen?.totales?.electronica || 0;
    const totalRobotica = resumen?.totales?.robots || 0;
    const totalMateriales = resumen?.totales?.materiales || 0;
    const prestamosActivos = resumen?.prestamos?.activos || 0;

    const disponibles = resumen?.equipos?.disponibles || 0;
    const enUso = resumen?.equipos?.en_uso || 0;
    const prestados = resumen?.equipos?.prestados || 0;
    const danados = resumen?.equipos?.danados || 0;
    const totalEstado = disponibles + enUso + prestados + danados || 1;
    const pctDisponibles = Math.round((disponibles / totalEstado) * 100);
    const pctEnUso = Math.round((enUso / totalEstado) * 100);
    const pctPrestados = Math.round((prestados / totalEstado) * 100);
    const pctDanados = Math.round((danados / totalEstado) * 100);

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Alert Section: Asymmetric Banner Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vencidos - Danger */}
                <div className="bg-[#fa746f]/40 dark:bg-[#e53f67]/20 p-6 rounded-xl flex items-start gap-4 border-l-4 border-[#a83836] dark:border-[#e53f67]">
                    <div className="bg-[#a83836] dark:bg-[#e53f67] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#a83836] dark:text-[#ff9fb3] leading-tight">Préstamos Vencidos</h3>
                        <p className="text-sm text-[#6e0a12] dark:text-[#ffccd5] mt-1">
                            {resumen?.prestamos?.vencidos || 0} préstamos requieren devolución inmediata.
                        </p>
                        <Link to="/prestamos?tab=vencidos">
                            <button className="mt-3 text-xs font-bold uppercase tracking-wider text-[#a83836] dark:text-[#ff9fb3] underline decoration-2 underline-offset-4">
                                Ver Detalles
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stock Bajo - Warning */}
                <div className="bg-[#dcedff]/40 dark:bg-[#3b438e]/20 p-6 rounded-xl flex items-start gap-4 border-l-4 border-[#495867] dark:border-[#5a62b8]">
                    <div className="bg-[#516170] dark:bg-[#5a62b8] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#374655] dark:text-[#9fb3ff] leading-tight">Stock Bajo</h3>
                        <p className="text-sm text-[#495867] dark:text-[#dddeff] mt-1">
                            Materiales críticos por debajo del umbral mínimo.
                        </p>
                        <Link to="/materiales">
                            <button className="mt-3 text-xs font-bold uppercase tracking-wider text-[#495867] dark:text-[#9fb3ff] underline decoration-2 underline-offset-4">
                                Reabastecer
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Mantenimiento - Info */}
                <div className="bg-[#cae6fe]/40 dark:bg-[#3b438e]/20 p-6 rounded-xl flex items-start gap-4 border-l-4 border-[#486277] dark:border-[#5a62b8]">
                    <div className="bg-[#486277] dark:bg-[#5a62b8] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#486277] dark:text-[#9fb3ff] leading-tight">Mantenimiento</h3>
                        <p className="text-sm text-[#3a5569] dark:text-[#dddeff] mt-1">
                            Equipos programados para revisión preventiva.
                        </p>
                        <Link to="/danados">
                            <button className="mt-3 text-xs font-bold uppercase tracking-wider text-[#3a5569] dark:text-[#9fb3ff] underline decoration-2 underline-offset-4">
                                Ver Calendario
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stat Cards: Bento Grid Style */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Equipos Card */}
                <Link to="/equipos">
                    <div className="bg-[#f1f4f5] dark:bg-[#292a69] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#d1e8dd] dark:hover:bg-[#3b438e] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Monitor className="h-6 w-6 text-[#4f645b] dark:text-[#9fb3ff] group-hover:text-[#2f433c] dark:group-hover:text-[#fdfdfd] transition-colors" />
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#d1e8dd] dark:bg-[#3b438e]/50 text-[#42564e] dark:text-[#dddeff] group-hover:bg-[#4f645b] dark:group-hover:bg-[#5a62b8] group-hover:text-white">+4%</span>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] dark:text-[#fdfdfd] group-hover:text-[#2f433c] dark:group-hover:text-[#fdfdfd] transition-colors">{totalEquipos}</p>
                            <p className="text-sm text-[#5a6062] dark:text-[#dddeff] group-hover:text-[#2f433c]/70 dark:group-hover:text-[#dddeff]/70 transition-colors">Total Equipos</p>
                        </div>
                    </div>
                </Link>

                {/* Electrónica Card */}
                <Link to="/electronica">
                    <div className="bg-[#f1f4f5] dark:bg-[#292a69] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#cae6fe] dark:hover:bg-[#3b438e] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Cpu className="h-6 w-6 text-[#486277] dark:text-[#9fb3ff] group-hover:text-[#274255] dark:group-hover:text-[#fdfdfd] transition-colors" />
                            <TrendingUp className="h-5 w-5 text-[#767c7e] dark:text-[#7b7b8b] group-hover:text-[#486277] dark:group-hover:text-[#9fb3ff] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] dark:text-[#fdfdfd] group-hover:text-[#274255] dark:group-hover:text-[#fdfdfd] transition-colors">{totalElectronica}</p>
                            <p className="text-sm text-[#5a6062] dark:text-[#dddeff] group-hover:text-[#274255]/70 dark:group-hover:text-[#dddeff]/70 transition-colors">Electrónica</p>
                        </div>
                    </div>
                </Link>

                {/* Robótica Card */}
                <Link to="/robotica">
                    <div className="bg-[#f1f4f5] dark:bg-[#292a69] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#f1f4f5] dark:hover:bg-[#3b438e] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Bot className="h-6 w-6 text-[#4f645b] dark:text-[#9fb3ff] group-hover:text-[#2f433c] dark:group-hover:text-[#fdfdfd] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] dark:text-[#fdfdfd]">{totalRobotica}</p>
                            <p className="text-sm text-[#5a6062] dark:text-[#dddeff]">Robots Activos</p>
                        </div>
                    </div>
                </Link>

                {/* Materiales Card */}
                <Link to="/materiales">
                    <div className="bg-[#f1f4f5] dark:bg-[#292a69] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#dcedff] dark:hover:bg-[#3b438e] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <FolderOpen className="h-6 w-6 text-[#516170] dark:text-[#9fb3ff] group-hover:text-[#374655] dark:group-hover:text-[#fdfdfd] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] dark:text-[#fdfdfd] group-hover:text-[#374655] dark:group-hover:text-[#fdfdfd] transition-colors">{totalMateriales}</p>
                            <p className="text-sm text-[#5a6062] dark:text-[#dddeff] group-hover:text-[#374655]/70 dark:group-hover:text-[#dddeff]/70 transition-colors">Tipos Material</p>
                        </div>
                    </div>
                </Link>

                {/* Préstamos Card */}
                <Link to="/prestamos">
                    <div className="bg-[#f1f4f5] dark:bg-[#292a69] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#fa746f]/20 dark:hover:bg-[#e53f67]/20 transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Send className="h-6 w-6 text-[#a83836] dark:text-[#ff9fb3] group-hover:text-[#6e0a12] dark:group-hover:text-[#ffccd5] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] dark:text-[#fdfdfd] group-hover:text-[#a83836] dark:group-hover:text-[#fdfdfd] transition-colors">{prestamosActivos}</p>
                            <p className="text-sm text-[#5a6062] dark:text-[#dddeff] group-hover:text-[#6e0a12]/70 dark:group-hover:text-[#ffccd5]/70 transition-colors">Préstamos Hoy</p>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Main Status & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Equipos por Estado */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-[#2d3335] dark:text-[#fdfdfd] tracking-tight">Equipos por Estado</h3>
                        <span className="text-sm text-[#5a6062] dark:text-[#dddeff] font-medium">Actualizado: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="bg-[#f1f4f5] dark:bg-[#22214d] p-8 rounded-2xl space-y-6">
                        {/* Disponible */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#4f645b] dark:bg-[#5a62b8]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335] dark:text-[#fdfdfd]">Disponibles</span>
                                    <span className="font-bold text-[#4f645b] dark:text-[#9fb3ff]">{resumen?.equipos?.disponibles || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white dark:bg-[#292a69] rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#4f645b] dark:bg-[#5a62b8] h-full rounded-full transition-all duration-500" style={{ width: `${pctDisponibles}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* En Uso */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#486277] dark:bg-[#5a62b8]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335] dark:text-[#fdfdfd]">En Uso</span>
                                    <span className="font-bold text-[#486277] dark:text-[#9fb3ff]">{resumen?.equipos?.en_uso || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white dark:bg-[#292a69] rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#486277] dark:bg-[#5a62b8] h-full rounded-full transition-all duration-500" style={{ width: `${pctEnUso}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Prestados */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#516170] dark:bg-[#5a62b8]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335] dark:text-[#fdfdfd]">Prestados</span>
                                    <span className="font-bold text-[#516170] dark:text-[#9fb3ff]">{resumen?.equipos?.prestados || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white dark:bg-[#292a69] rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#516170] dark:bg-[#5a62b8] h-full rounded-full transition-all duration-500" style={{ width: `${pctPrestados}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Dañados */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#a83836] dark:bg-[#e53f67]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335] dark:text-[#fdfdfd]">Dañados</span>
                                    <span className="font-bold text-[#a83836] dark:text-[#ff9fb3]">{resumen?.equipos?.danados || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white dark:bg-[#292a69] rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#a83836] dark:bg-[#e53f67] h-full rounded-full transition-all duration-500" style={{ width: `${pctDanados}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Loan Status */}
                <section className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[#2d3335] dark:text-[#fdfdfd] tracking-tight">Estado de Préstamos</h3>
                        <Link to="/prestamos" className="text-sm font-semibold text-[#4f645b] dark:text-[#5a62b8] flex items-center gap-1">
                            Ver todo <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="bg-[#f1f4f5] dark:bg-[#22214d] p-8 rounded-2xl space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            {/* Activos */}
                            <div className="bg-white dark:bg-[#292a69] p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <RefreshCcw className="h-4 w-4 text-[#4f645b] dark:text-[#9fb3ff]" />
                                    <span className="text-xs font-bold text-[#5a6062] dark:text-[#dddeff] uppercase tracking-wider">Activos</span>
                                </div>
                                <p className="text-3xl font-black text-[#2d3335] dark:text-[#fdfdfd]">{resumen?.prestamos?.activos || 0}</p>
                            </div>

                            {/* Devueltos */}
                            <div className="bg-white dark:bg-[#292a69] p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                                    <span className="text-xs font-bold text-[#5a6062] dark:text-[#dddeff] uppercase tracking-wider">Devueltos</span>
                                </div>
                                <p className="text-3xl font-black text-[#2d3335] dark:text-[#fdfdfd]">{resumen?.prestamos?.devueltos || 0}</p>
                            </div>

                            {/* Vencidos */}
                            <div className="bg-white dark:bg-[#292a69] p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                                    <span className="text-xs font-bold text-[#5a6062] dark:text-[#dddeff] uppercase tracking-wider">Vencidos</span>
                                </div>
                                <p className="text-3xl font-black text-[#a83836] dark:text-[#ff9fb3]">{resumen?.prestamos?.vencidos || 0}</p>
                            </div>
                        </div>

                        {/* Por Vencer */}
                        <div className="bg-[#dcedff] dark:bg-[#3b438e]/30 p-6 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-[#374655] dark:text-[#9fb3ff]">Préstamos por Vencer</p>
                                    <p className="text-xs text-[#495867] dark:text-[#dddeff]">En los próximos 7 días</p>
                                </div>
                                <p className="text-3xl font-black text-[#486277] dark:text-[#9fb3ff]">{resumen?.prestamos?.por_vencer_7_dias || 0}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Floating Quick Action (QR Scanner) */}
            <button
                className="fixed bottom-10 right-10 w-16 h-16 bg-[#4f645b] dark:bg-[#3b438e] text-white rounded-full shadow-xl dark:shadow-[#3b438e]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
                title="Escanear Código QR"
            >
                <QrCode className="h-7 w-7" />
                <span className="absolute right-full mr-4 bg-gray-900 dark:bg-[#22214d] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity font-semibold">
                    Escanear Activo
                </span>
            </button>
        </div>
    );
}
