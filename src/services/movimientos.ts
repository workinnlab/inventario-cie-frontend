import api from '@/lib/api';
import type { Movimiento, MovimientoCreate } from '@/types';

export async function getAll(skip = 0, limit = 1000, tipo?: string): Promise<Movimiento[]> {
    let url = `/movimientos?skip=${skip}&limit=${limit}`;
    if (tipo) url += `&tipo=${tipo}`;
    const { data } = await api.get(url);
    return data;
}

export async function getById(id: number): Promise<Movimiento> {
    const { data } = await api.get(`/movimientos/${id}`);
    return data;
}

export async function create(movimiento: MovimientoCreate): Promise<Movimiento> {
    const { data } = await api.post('/movimientos', movimiento);
    return data;
}

