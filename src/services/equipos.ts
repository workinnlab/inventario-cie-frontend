import api from '@/lib/api';
import type { Equipo, EquipoCreate, EquipoUpdate } from '@/types';

export async function getAll(skip = 0, limit = 1000): Promise<Equipo[]> {
    const { data } = await api.get(`/equipos?skip=${skip}&limit=${limit}`);
    return data;
}

export async function getByEstado(estado: string): Promise<Equipo[]> {
    const { data } = await api.get(`/equipos?estado=${estado}`);
    return data;
}

export async function getById(id: number): Promise<Equipo> {
    const { data } = await api.get(`/equipos/${id}`);
    return data;
}

export async function getByCodigo(codigo: string): Promise<Equipo> {
    const { data } = await api.get(`/equipos/codigo/${codigo}`);
    return data;
}

export async function create(equipo: EquipoCreate): Promise<Equipo> {
    const { data } = await api.post('/equipos', equipo);
    return data;
}

export async function update(id: number, equipo: EquipoUpdate): Promise<Equipo> {
    const { data } = await api.put(`/equipos/${id}`, equipo);
    return data;
}

export async function remove(id: number): Promise<void> {
    await api.delete(`/equipos/${id}`);
}

