import api from '@/lib/api';
import type { Electronica, ElectronicaCreate, ElectronicaUpdate } from '@/types';

export async function getAll(skip = 0, limit = 20, nombre?: string): Promise<Electronica[]> {
    const params = new URLSearchParams({ 
        skip: String(skip), 
        limit: String(limit) });

    const { data } = await api.get(`/electronica?${params.toString()}`);
    return data;
}

export async function getById(id: number): Promise<Electronica> {
    const { data } = await api.get(`/electronica/${id}`);
    return data;
}

export async function create(item: ElectronicaCreate): Promise<Electronica> {
    const { data } = await api.post('/electronica', item);
    return data;
}

export async function update(id: number, item: ElectronicaUpdate): Promise<Electronica> {
    const { data } = await api.put(`/electronica/${id}`, item);
    return data;
}

export async function remove(id: number): Promise<void> {
    await api.delete(`/electronica/${id}`);
}

