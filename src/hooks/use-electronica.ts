import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as electronicaService from '@/services/electronica';
import { Electronica, ElectronicaCreate, ElectronicaUpdate } from '@/types';

const PAGE_SIZE = 20;

export const useElectronica = () => {
    const queryClient = useQueryClient();
    // Cambios para manejar paginación y búsqueda
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const skip = (page - 1) * PAGE_SIZE;

    const electronicaQuery = useQuery({

        queryKey: ['electronica', page, search],
        queryFn: () => electronicaService.getAll(skip, PAGE_SIZE, search),
        retry: 2,
        refetchOnWindowFocus: false,
        placeholderData: (prev) =>  prev, //Mantener datos anteriores mientras carga la nueva pag.
    });

    /*Total de páginas calculado desde el header X-Total-Count que
     el backend debe retornar */
     /*
    const total: number = (electronicaQuery.data as any)?._total ?? electronicaQuery.data?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));*/
    //-----¡Atención! Lo siguiente es un workaround temporal hasta que supabase tenga un endpoint para contar registros-----------
    const countQuery = useQuery({
        queryKey: ['electronica', 'count', search],
        queryFn: () => electronicaService.getAll(0, 1000, search),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const total = countQuery.data?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    
    //-------Fin del workaround. Cuando se consiga el endpoint, se puede quitar el WA y reemplazarlo por el codigo comentado anterior--------------------
    

    const createElectronicaMutation = useMutation({
        mutationFn: (data: ElectronicaCreate) => electronicaService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
        },
    });

    const updateElectronicaMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ElectronicaUpdate }) =>
            electronicaService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
        },
    });

    const deleteElectronicaMutation = useMutation({
        mutationFn: (id: number) => electronicaService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
        },
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Volver a la pagina 1 al buscar
    };

    return {
        electronica: electronicaQuery.data ?? [],
        isLoading: electronicaQuery.isLoading,
        isError: electronicaQuery.isError,
        error: electronicaQuery.error,
        // Paginación
        page,
        totalPages,
        setPage,
        // Búsqueda
        search,
        setSearch: handleSearchChange,
        // Mutaciones
        createElectronica: createElectronicaMutation.mutateAsync,
        updateElectronica: updateElectronicaMutation.mutateAsync,
        deleteElectronica: deleteElectronicaMutation.mutateAsync,
        isCreating: createElectronicaMutation.isPending,
        isUpdating: updateElectronicaMutation.isPending,
        isDeleting: deleteElectronicaMutation.isPending,
    };
};
