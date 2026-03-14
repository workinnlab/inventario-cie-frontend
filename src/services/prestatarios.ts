import api from '@/lib/api';
import type { Prestatario, PrestatarioCreate, PrestatarioUpdate } from '@/types';

export async function getAll(skip = 0, limit = 1000, activo?: boolean): Promise<Prestatario[]> {
    let url = `/prestatarios?skip=${skip}&limit=${limit}`;
    if (activo !== undefined) url += `&activo=${activo}`;
    const { data } = await api.get(url);
    return data;
}

export async function getById(id: number): Promise<Prestatario> {
    const { data } = await api.get(`/prestatarios/${id}`);
    return data;
}

export async function create(prestatario: PrestatarioCreate): Promise<Prestatario> {
    const { data } = await api.post('/prestatarios', prestatario);
    return data;
}

export async function update(id: number, prestatario: PrestatarioUpdate): Promise<Prestatario> {
    const { data } = await api.put(`/prestatarios/${id}`, prestatario);
    return data;
}

export async function remove(id: number): Promise<void> {
    await api.delete(`/prestatarios/${id}`);
}

