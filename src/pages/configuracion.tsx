import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, AlertTriangle, Package, ClipboardList, Monitor, Cpu, Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { configuracionService, ConfiguracionAlerta } from '@/services/configuracion';
import { getErrorMessage } from '@/utils/error-handler';
import { Spinner } from '@/components/ui/spinner';

export default function ConfiguracionPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { hasRole } = useAuth();

    const { data: configuraciones = [], isLoading, isError, error } = useQuery({
        queryKey: ['configuracion-alertas'],
        queryFn: configuracionService.getAll,
    });

    const updateMutation = useMutation({
        mutationFn: ({ clave, valor }: { clave: string; valor: number }) =>
            configuracionService.update(clave, valor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['configuracion-alertas'] });
            toast('Configuración actualizada', 'success');
        },
        onError: (err: any) => {
            toast(getErrorMessage(err), 'error');
        }
    });

    const getConfigIcon = (clave: string) => {
        if (clave.includes('stock') || clave.includes('material')) return <Package className="h-5 w-5 text-[#4f645b]" />;
        if (clave.includes('prestamo') || clave.includes('vencer')) return <ClipboardList className="h-5 w-5 text-[#486277]" />;
        if (clave.includes('equipo') || clave.includes('danado')) return <Monitor className="h-5 w-5 text-red-500" />;
        if (clave.includes('electronica')) return <Cpu className="h-5 w-5 text-blue-500" />;
        if (clave.includes('robotica')) return <Bot className="h-5 w-5 text-purple-500" />;
        return <Settings className="h-5 w-5 text-muted-foreground" />;
    };

    const getConfigCategory = (clave: string): string => {
        if (clave.includes('stock') || clave.includes('material')) return 'stock';
        if (clave.includes('prestamo') || clave.includes('vencer')) return 'prestamos';
        if (clave.includes('equipo') || clave.includes('danado')) return 'equipos';
        if (clave.includes('electronica')) return 'electronica';
        if (clave.includes('robotica')) return 'robotica';
        return 'general';
    };

    const groupedConfigs = configuraciones.reduce((acc, config) => {
        const category = getConfigCategory(config.clave);
        if (!acc[category]) acc[category] = [];
        acc[category].push(config);
        return acc;
    }, {} as Record<string, ConfiguracionAlerta[]>);

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'stock': return 'Alertas de Stock';
            case 'prestamos': return 'Alertas de Préstamos';
            case 'equipos': return 'Alertas de Equipos';
            case 'electronica': return 'Alertas de Electrónica';
            case 'robotica': return 'Alertas de Robótica';
            default: return 'General';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'stock': return <Package className="h-5 w-5" />;
            case 'prestamos': return <ClipboardList className="h-5 w-5" />;
            case 'equipos': return <Monitor className="h-5 w-5" />;
            case 'electronica': return <Cpu className="h-5 w-5" />;
            case 'robotica': return <Bot className="h-5 w-5" />;
            default: return <Settings className="h-5 w-5" />;
        }
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold text-[#2d3335] dark:text-[#fdfdfd]">Error al cargar la configuración</h3>
                    <p className="text-sm text-muted-foreground dark:text-[#7b7b8b]">{error?.message || 'Revisa tu conexión'}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()} className="dark:bg-[#292a69] dark:text-[#fdfdfd] dark:hover:bg-[#3b438e]/50">Reintentar</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] dark:text-[#fdfdfd] tracking-tighter leading-none">Configuración</h2>
                    <p className="text-[#5a6062] dark:text-[#dddeff] max-w-md">Administra los umbrales y límites del sistema.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#22214d] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100/50 dark:border-[#292a69]/50 overflow-hidden">
                <div className="p-8">
                    <p className="text-sm text-muted-foreground dark:text-[#7b7b8b] mb-6">
                        Configura los umbrales y límites del sistema. Los cambios se guardan automáticamente al hacer clic en Guardar.
                    </p>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : configuraciones.length === 0 ? (
                        <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground dark:text-[#7b7b8b] dark:border-[#292a69]">
                            No hay configuraciones disponibles. Contacta al administrador.
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                            {Object.entries(groupedConfigs).map(([category, configs]) => (
                                <div key={category} className="space-y-3">
                                    <div className="flex items-center gap-2 text-[#4f645b] dark:text-[#5a62b8] font-semibold border-b dark:border-[#292a69] pb-2">
                                        {getCategoryIcon(category)}
                                        <span>{getCategoryLabel(category)}</span>
                                    </div>
                                    <div className="grid gap-3">
                                        {configs.map((config) => (
                                            <ConfigRow
                                                key={config.id}
                                                config={config}
                                                updateMutation={updateMutation}
                                                getIcon={getConfigIcon}
                                                toast={toast}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ConfigRow({ 
    config, 
    updateMutation, 
    getIcon,
    toast
}: { 
    config: ConfiguracionAlerta; 
    updateMutation: any;
    getIcon: (clave: string) => JSX.Element;
    toast: any;
}) {
    const [valor, setValor] = useState(config.valor.toString());
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
        setValor(config.valor.toString());
        setIsModified(false);
    }, [config.valor]);

    const handleChange = (newValue: string) => {
        setValor(newValue);
        setIsModified(newValue !== config.valor.toString());
    };

    const handleSave = () => {
        const num = parseInt(valor);
        if (isNaN(num)) {
            toast('Debe ingresar un valor numérico válido', 'error');
            return;
        }
        updateMutation.mutate({ clave: config.clave, valor: num });
        setIsModified(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-[#292a69] rounded-lg">
            <div className="p-2 bg-white dark:bg-[#22214d] rounded-lg shadow-sm">
                {getIcon(config.clave)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2d3335] dark:text-[#fdfdfd] truncate">
                    {config.descripcion || config.clave.replace(/_/g, ' ').toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground dark:text-[#7b7b8b] truncate" title={config.clave}>
                    {config.clave}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={valor}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-20 h-9 text-center font-mono dark:bg-[#22214d] dark:text-[#fdfdfd] dark:border-[#292a69]"
                />
                <Button
                    size="sm"
                    variant={isModified ? 'primary' : 'outline'}
                    disabled={!isModified || updateMutation.isPending}
                    onClick={handleSave}
                    className="shrink-0"
                >
                    {updateMutation.isPending ? (
                        <Spinner size="sm" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
