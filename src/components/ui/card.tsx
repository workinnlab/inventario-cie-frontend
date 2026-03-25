import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    glass?: boolean;
}

export function Card({ children, className, glass }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-3xl border border-border transition-all duration-300',
                glass
                    ? 'glass-card'
                    : 'bg-card text-card-foreground shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/20',
                className,
            )}
        >
            {children}
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
    return (
        <Card glass className={cn('p-5 hover:shadow-lg transition-shadow duration-300', className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">{title}</p>
                    <p className="text-2xl font-bold tracking-tight text-foreground dark:text-white">{value}</p>
                    {trend && <p className="text-xs text-muted-foreground dark:text-slate-400">{trend}</p>}
                </div>
                <div className="rounded-lg bg-primary/10 dark:bg-primary/20 p-2.5 text-primary dark:text-primary-foreground">{icon}</div>
            </div>
        </Card>
    );
}
