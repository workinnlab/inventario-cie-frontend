import { Bell, LogOut, Search, Menu, UserCircle, Moon, Sun, X, AlertTriangle, CheckCircle, Trash2, Check } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useSearch } from '@/contexts/search-context';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface Notificacion {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: 'warning' | 'error' | 'success';
    leida: boolean;
    ruta: string;
}

interface HeaderProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { searchQuery, setSearchQuery } = useSearch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
        { id: 1, titulo: 'Préstamo por vencer', descripcion: 'El préstamo #123 vence mañana', tipo: 'warning', leida: false, ruta: '/prestamos?tab=vencidos' },
        { id: 2, titulo: 'Stock bajo', descripcion: 'Filamento PLA Blanco tiene stock bajo', tipo: 'error', leida: false, ruta: '/materiales' },
        { id: 3, titulo: 'Préstamo devuelto', descripcion: 'El equipo MacBook Pro fue devuelto', tipo: 'success', leida: true, ruta: '/prestamos' },
        { id: 4, titulo: 'Equipo dañado', descripcion: 'Se reportó un equipo como dañado', tipo: 'error', leida: false, ruta: '/danados' },
        { id: 5, titulo: 'Nuevo préstamo', descripcion: 'Se registró un nuevo préstamo', tipo: 'success', leida: false, ruta: '/prestamos' },
    ]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        try {
            setDropdownOpen(false);
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
        }
    };

    const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

    const handleNotifClick = (id: number, ruta: string) => {
        // Marcar como leída
        setNotificaciones(prev => prev.map(n => 
            n.id === id ? { ...n, leida: true } : n
        ));
        setNotifOpen(false);
        navigate(ruta);
    };

    const marcarTodasLeidas = () => {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    };

    const limpiarNotificaciones = () => {
        setNotificaciones([]);
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white/70 dark:bg-[#13152d]/70 backdrop-blur-xl px-8 shadow-sm shadow-emerald-900/5 dark:shadow-black/20 dark:border-[#292a69]">
            <div className="flex items-center gap-4">
                {onMenuClick && (
                    <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-muted-foreground dark:text-[#dddeff] hover:text-foreground dark:hover:text-[#fdfdfd]">
                        <Menu className="h-6 w-6" />
                    </Button>
                )}
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-[#1a1f1c] dark:text-[#fdfdfd]">Inventario CIE API</h1>
                    <span className="text-gray-300 dark:text-[#292a69] mx-2 text-xl">|</span>
                    <span className="text-muted-foreground dark:text-[#dddeff] font-medium">{title}</span>
                </div>
            </div>

            {/* Center Search Bar - Global Search */}
            <div className="hidden md:flex relative w-full max-w-md mx-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 dark:text-[#dddeff]" />
                <input
                    type="text"
                    placeholder="Buscar en el inventario..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            // Navegar a la página de equipos con el término de búsqueda
                            navigate(`/equipos?search=${encodeURIComponent(searchQuery)}`);
                        }
                    }}
                    className="w-full h-11 bg-slate-100 dark:bg-[#292a69] hover:bg-slate-200 dark:hover:bg-[#3b438e]/50 transition-colors rounded-full pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] dark:focus:ring-[#3b438e]/50 focus:border-[#4f645b] dark:focus:border-[#3b438e] border border-transparent dark:text-[#fdfdfd] dark:placeholder:text-[#7b7b8b]"
                />
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#292a69] transition-colors"
                    >
                        <Bell className="h-5 w-5 text-[#5a6062] dark:text-[#dddeff]" />
                        {notificacionesNoLeidas > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 border-2 border-white dark:border-[#13152d] text-[10px] text-white flex items-center justify-center font-bold">
                                {notificacionesNoLeidas}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border bg-white dark:bg-[#22214d] shadow-xl animate-scale-in overflow-hidden dark:border-[#292a69]">
                            <div className="px-4 py-3 border-b flex items-center justify-between bg-slate-50 dark:bg-[#292a69]/50 dark:border-[#292a69]">
                                <h3 className="font-bold text-[#2d3335] dark:text-[#fdfdfd]">Notificaciones</h3>
                                <button
                                    onClick={() => setNotifOpen(false)}
                                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-[#3b438e]"
                                >
                                    <X className="h-4 w-4 text-muted-foreground dark:text-[#dddeff]" />
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notificaciones.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-muted-foreground dark:text-[#dddeff]">
                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No tienes notificaciones</p>
                                    </div>
                                ) : (
                                    <>
                                        {notificaciones.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => handleNotifClick(notif.id, notif.ruta)}
                                                className={cn(
                                                    "px-4 py-3 border-b hover:bg-slate-50 dark:hover:bg-[#292a69]/50 cursor-pointer transition-colors dark:border-[#292a69]",
                                                    !notif.leida && "bg-blue-50/50 dark:bg-blue-900/20"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                                        notif.tipo === 'warning' && "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
                                                        notif.tipo === 'error' && "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
                                                        notif.tipo === 'success' && "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                                                    )}>
                                                        {notif.tipo === 'warning' && <AlertTriangle className="h-4 w-4" />}
                                                        {notif.tipo === 'error' && <AlertTriangle className="h-4 w-4" />}
                                                        {notif.tipo === 'success' && <CheckCircle className="h-4 w-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-[#2d3335] dark:text-[#fdfdfd]">{notif.titulo}</p>
                                                        <p className="text-xs text-muted-foreground dark:text-[#7b7b8b] truncate">{notif.descripcion}</p>
                                                    </div>
                                                    {!notif.leida && (
                                                        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            {notificaciones.length > 0 && (
                                <div className="px-4 py-2 bg-slate-50 dark:bg-[#292a69]/50 flex justify-center gap-6 dark:border-t dark:border-[#292a69]">
                                    <button
                                        onClick={() => { setNotifOpen(false); navigate('/notificaciones'); }}
                                        className="text-[#4f645b] dark:text-[#5a62b8] hover:text-[#3a5046] dark:hover:text-[#7a82c8] p-1 rounded hover:bg-slate-200 dark:hover:bg-[#3b438e]"
                                        title="Ver todas"
                                    >
                                        <Bell className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={marcarTodasLeidas}
                                        className="text-[#4f645b] dark:text-[#5a62b8] hover:text-[#3a5046] dark:hover:text-[#7a82c8] p-1 rounded hover:bg-slate-200 dark:hover:bg-[#3b438e]"
                                        title="Marcar todas como leídas"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={limpiarNotificaciones}
                                        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                        title="Limpiar todo"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            {notificaciones.length === 0 && (
                                <div className="px-4 py-2 bg-slate-50 dark:bg-[#292a69]/50 flex justify-center dark:border-t dark:border-[#292a69]">
                                    <button
                                        onClick={() => { setNotifOpen(false); navigate('/notificaciones'); }}
                                        className="text-[#4f645b] dark:text-[#5a62b8] hover:text-[#3a5046] dark:hover:text-[#7a82c8] p-1 rounded hover:bg-slate-200 dark:hover:bg-[#3b438e]"
                                        title="Ver todas"
                                    >
                                        <Bell className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#292a69] transition-colors"
                    title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                >
                    {theme === 'dark' ? (
                        <Sun className="h-5 w-5 text-[#dddeff]" />
                    ) : (
                        <Moon className="h-5 w-5 text-[#5a6062]" />
                    )}
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                    >
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="font-bold text-sm text-[#1a1f1c] dark:text-[#fdfdfd] leading-tight">{user?.nombre || 'Usuario'}</span>
                            <span className="text-[11px] text-muted-foreground dark:text-[#dddeff] capitalize font-medium">{user?.rol || 'Administrador'}</span>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1f1c] dark:bg-[#3b438e] text-white overflow-hidden">
                            <UserCircle className="h-full w-full opacity-80" />
                        </div>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border bg-white dark:bg-[#22214d] p-2 shadow-xl animate-scale-in dark:border-[#292a69]">
                            <div className="px-3 py-3 border-b mb-1 dark:border-[#292a69]">
                                <p className="text-sm font-bold text-[#1a1f1c] dark:text-[#fdfdfd] truncate">{user?.nombre}</p>
                                <p className="text-xs text-muted-foreground dark:text-[#dddeff] truncate">{user?.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
