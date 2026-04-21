import api from '@/lib/api';
import type { Notificacion } from '@/types';

export async function getAll(skip = 0, limit = 100): Promise<Notificacion[]> {
    const { data } = await api.get(`/notificaciones?skip=${skip}&limit=${limit}`);
    return data;
}

export async function markAsRead(id: number): Promise<Notificacion> {
    const { data } = await api.put(`/notificaciones/${id}/leer`);
    return data;
}

export async function markAllAsRead(): Promise<number> {
    const { data } = await api.put('/notificaciones/leer-todas');
    return data;
}

export async function remove(id: number): Promise<void> {
    await api.delete(`/notificaciones/${id}`);
}