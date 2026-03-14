import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/utils/cn';

const pageTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/equipos': 'Equipos de Cómputo',
    '/electronica': 'Electrónica',
    '/robots': 'Robots',
    '/materiales': 'Materiales',
    '/prestatarios': 'Prestatarios',
    '/prestamos': 'Préstamos',
    '/movimientos': 'Movimientos',
    '/exportar': 'Exportar Datos',
};

export function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'Inventario CIE';

    return (
        <div className="min-h-screen bg-background">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div
                className={cn(
                    'transition-all duration-300',
                    collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]',
                )}
            >
                <Header
                    title={title}
                    onMenuClick={() => setCollapsed(!collapsed)}
                />
                <main className="p-6 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
