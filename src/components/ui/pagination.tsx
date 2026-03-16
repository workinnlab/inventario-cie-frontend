import { cn } from '@/utils/cn';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={cn('flex items-center justify-between px-1 py-2', className)}>
            <p className="text-sm text-muted-foreground">
                Página <span className="font-medium text-foreground">{page}</span> de{' '}
                <span className="font-medium text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Números de página */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                            acc.push('ellipsis');
                        }
                        acc.push(p);
                        return acc;
                    }, [])
                    .map((p, idx) =>
                        p === 'ellipsis' ? (
                            <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">
                                …
                            </span>
                        ) : (
                            <Button
                                key={p}
                                variant={p === page ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(p as number)}
                                className="min-w-[2rem]"
                            >
                                {p}
                            </Button>
                        )
                    )}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Página siguiente"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}