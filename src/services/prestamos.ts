import api from '@/lib/api';
import type { Prestamo, PrestamoCreate, PrestamoUpdate } from '@/types';

export async function getAll(skip = 0, limit = 1000, estado?: string): Promise<Prestamo[]> {
    let url = `/prestamos?skip=${skip}&limit=${limit}`;
    if (estado) url += `&estado=${estado}`;
    const { data } = await api.get(url);
    return data;
}

export async function getPorVencer(dias: number = 7): Promise<Prestamo[]> {
    const { data } = await api.get(`/prestamos/por-vencer?dias=${dias}`);
    return data;
}

export async function getActivos(): Promise<Prestamo[]> {
    const { data } = await api.get('/prestamos/activos');
    return data;
}

export async function getById(id: number): Promise<Prestamo> {
    const { data } = await api.get(`/prestamos/${id}`);
    return data;
}

export async function create(prestamo: PrestamoCreate): Promise<Prestamo> {
    const { data } = await api.post('/prestamos', prestamo);
    return data;
}

export async function update(id: number, prestamo: PrestamoUpdate): Promise<Prestamo> {
    const { data } = await api.put(`/prestamos/${id}`, prestamo);
    return data;
}

export async function devolver(id: number): Promise<Prestamo> {
    const { data } = await api.post(`/prestamos/${id}/devolver`);
    return data;
}

export async function remove(id: number): Promise<void> {
    await api.delete(`/prestamos/${id}`);
}

