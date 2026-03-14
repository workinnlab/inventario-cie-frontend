import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Monitor, Cpu, Bot, Package, Users, ClipboardList, History, Download, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useState } from 'react';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/equipos', icon: Monitor, label: 'Equipos' },
    { to: '/electronica', icon: Cpu, label: 'Electrónica' },
    { to: '/robots', icon: Bot, label: 'Robots' },
    { to: '/materiales', icon: Package, label: 'Materiales' },
    { to: '/prestatarios', icon: Users, label: 'Prestatarios' },
    { to: '/prestamos', icon: ClipboardList, label: 'Préstamos' },
    { to: '/movimientos', icon: History, label: 'Movimientos' },
    { to: '/exportar', icon: Download, label: 'Exportar' },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 flex flex-col',
                collapsed ? 'w-[68px]' : 'w-[240px]',
            )}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    CI
                </div>
                {!collapsed && (
                    <span className="font-semibold text-sm whitespace-nowrap">Inventario CIE</span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                'hover:bg-accent hover:text-accent-foreground',
                                isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-muted-foreground',
                                collapsed && 'justify-center px-0',
                            )
                        }
                        title={collapsed ? label : undefined}
                    >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse button */}
            <div className="border-t p-3">
                <button
                    onClick={onToggle}
                    className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </div>
        </aside>
    );
}
