import api from '@/lib/api';
import type { Material, MaterialCreate, MaterialUpdate, TipoMaterial } from '@/types';

export async function getAll(skip = 0, limit = 1000): Promise<Material[]> {
    const { data } = await api.get(`/materiales?skip=${skip}&limit=${limit}`);
    return data;
}

export async function getStockMinimo(minimo: number = 5): Promise<Material[]> {
    const { data } = await api.get(`/materiales/stock-minimo?minimo=${minimo}`);
    return data;
}

export async function getById(id: number): Promise<Material> {
    const { data } = await api.get(`/materiales/${id}`);
    return data;
}

export async function getTipos(): Promise<TipoMaterial[]> {
    const { data } = await api.get('/tipos-materiales');
    return data;
}

export async function create(material: MaterialCreate): Promise<Material> {
    const { data } = await api.post('/materiales', material);
    return data;
}

export async function update(id: number, material: MaterialUpdate): Promise<Material> {
    const { data } = await api.put(`/materiales/${id}`, material);
    return data;
}

export async function remove(id: number): Promise<void> {
    await api.delete(`/materiales/${id}`);
}

