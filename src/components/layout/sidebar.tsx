import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Archive, Cpu, Bot, Package, Layers, AlertTriangle, BarChart3, Settings, HelpCircle, LogOut, Plus, ChevronDown, Users, PanelLeftClose, PanelLeft, History
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

const inventarioItems = [
    { to: '/equipos', icon: Archive, label: 'Equipos' },
    { to: '/electronica', icon: Cpu, label: 'Electrónica' },
    { to: '/robotica', icon: Bot, label: 'Robótica' },
    { to: '/materiales', icon: Package, label: 'Materiales' },
];

const otherItems = [
    { to: '/prestamos', icon: Layers, label: 'Préstamos' },
    { to: '/prestatarios', icon: Users, label: 'Prestatarios' },
    { to: '/movimientos', icon: History, label: 'Movimientos' },
    { to: '/danados', icon: AlertTriangle, label: 'Dañados' },
    { to: '/reportes', icon: BarChart3, label: 'Reportes' },
    { to: '/configuracion', icon: Settings, label: 'Configuración' },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    onAddNew: () => void;
}

export function Sidebar({ collapsed, onToggle, onAddNew }: SidebarProps) {
    const { hasRole, logout, user } = useAuth();
    const [inventarioOpen, setInventarioOpen] = useState(true);

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen transition-all duration-300 flex flex-col',
                collapsed ? 'w-20' : 'w-64',
                'bg-slate-50 dark:bg-slate-900 border-r-0'
            )}
        >
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-4 h-20 shrink-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4f645b] text-white shadow-lg shadow-[#4f645b]/20">
                    <Archive className="h-5 w-5" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col animate-fade-in">
                        <span className="font-bold text-[#1a1f1c] dark:text-white text-base leading-tight">The Curator</span>
                        <span className="text-[10px] font-semibold text-[#5a6062] tracking-wider">GESTIÓN DE ACTIVOS</span>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className={cn(
                        "ml-auto p-2 rounded-lg text-[#5a6062] dark:text-slate-400 hover:text-[#4f645b] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors",
                        collapsed && "absolute top-6 right-2"
                    )}
                    title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                >
                    {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
                {/* Dashboard */}
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 relative',
                            isActive
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-[#4f645b] dark:text-emerald-400 font-bold border-r-4 border-[#4f645b]'
                                : 'text-[#5a6062] dark:text-slate-400 hover:text-[#4f645b] dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10',
                            collapsed ? 'justify-center px-0' : ''
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <LayoutDashboard className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-[#4f645b] dark:text-emerald-400" : "text-[#5a6062] dark:text-slate-400")} />
                            {!collapsed && <span className="text-sm font-semibold">Dashboard</span>}
                        </>
                    )}
                </NavLink>

                {/* Inventario Dropdown */}
                {!collapsed ? (
                    <div className="mt-2">
                        <button
                            onClick={() => setInventarioOpen(!inventarioOpen)}
                            className="flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 w-full text-left text-[#5a6062] hover:text-[#4f645b] hover:bg-emerald-50/50"
                        >
                            <Package className="h-5 w-5 shrink-0" />
                            <span className="text-sm font-semibold flex-1">Inventario</span>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", inventarioOpen && "rotate-180")} />
                        </button>
                        
                        {inventarioOpen && (
                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#dee3e6] pl-4">
                                {inventarioItems.map(({ to, icon: Icon, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        className={({ isActive }) =>
                                            cn(
                                                'flex items-center gap-3 py-2.5 px-3 rounded-xl font-medium transition-all duration-200 text-sm',
                                                isActive
                                                    ? 'bg-[#4f645b] text-white font-bold'
                                                    : 'text-[#5a6062] hover:text-[#4f645b] hover:bg-emerald-50/50'
                                            )
                                        }
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-2 flex flex-col gap-1">
                        {inventarioItems.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center justify-center py-3 rounded-xl transition-all duration-200',
                                        isActive
                                            ? 'bg-[#4f645b] text-white'
                                            : 'text-[#5a6062] hover:text-[#4f645b] hover:bg-emerald-50/50'
                                    )
                                }
                                title={label}
                            >
                                <Icon className="h-5 w-5" />
                            </NavLink>
                        ))}
                    </div>
                )}

                {/* Other Items */}
                {otherItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 relative',
                                isActive
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-[#4f645b] dark:text-emerald-400 font-bold border-r-4 border-[#4f645b]'
                                    : 'text-[#5a6062] dark:text-slate-400 hover:text-[#4f645b] dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10',
                                collapsed ? 'justify-center px-0' : ''
                            )
                        }
                        title={collapsed ? label : undefined}
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-[#4f645b] dark:text-emerald-400" : "text-[#5a6062] dark:text-slate-400")} />
                                {!collapsed && <span className="text-sm font-semibold">{label}</span>}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 flex flex-col gap-2 shrink-0">
                <Button
                    onClick={onAddNew}
                    className={cn(
                        "w-full bg-gradient-to-br from-[#4f645b] to-[#43574f] hover:brightness-110 text-white rounded-xl h-12 shadow-md gap-2 font-semibold justify-center",
                        collapsed ? "px-0" : "px-4"
                    )}
                >
                    <Plus className="h-5 w-5" />
                    {!collapsed && <span>Agregar Nuevo</span>}
                </Button>

                <div className="flex flex-col gap-1 mt-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => window.open('/docs/MANUAL_USUARIO.pdf', '_blank')}
                        className={cn(
                            "flex items-center gap-3 py-2.5 rounded-xl text-[#5a6062] dark:text-slate-400 hover:text-[#4f645b] dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors",
                            collapsed ? "justify-center" : "px-4"
                        )}
                    >
                        <HelpCircle className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">Ayuda</span>}
                    </button>
                    <button
                        onClick={() => logout()}
                        className={cn(
                            "flex items-center gap-3 py-2.5 rounded-xl text-[#5a6062] dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors",
                            collapsed ? "justify-center" : "px-4"
                        )}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
