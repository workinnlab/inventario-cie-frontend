import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificacionesService from '@/services/notificaciones';
import { Notificacion } from '@/types';

export const useNotificaciones = () => {
    const queryClient = useQueryClient();

    const notificacionesQuery = useQuery({
        queryKey: ['notificaciones'],
        queryFn: () => notificacionesService.getAll(),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const markAsReadMutation = useMutation({
        mutationFn: (id: number) => notificacionesService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => notificacionesService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => notificacionesService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
        },
    });

    return {
        notificaciones: notificacionesQuery.data ?? [],
        isLoading: notificacionesQuery.isLoading,
        isError: notificacionesQuery.isError,
        error: notificacionesQuery.error,
        markAsRead: markAsReadMutation.mutateAsync,
        markAllAsRead: markAllAsReadMutation.mutateAsync,
        deleteNotificacion: deleteMutation.mutateAsync,
        isMarkingAsRead: markAsReadMutation.isPending,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};