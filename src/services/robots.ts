import api from '@/lib/api';
import type { Robot, RobotCreate, RobotUpdate } from '@/types';

export async function getAll(skip = 0, limit = 1000): Promise<Robot[]> {
    const { data } = await api.get(`/robots?skip=${skip}&limit=${limit}`);
    return data;
}

export async function getById(id: number): Promise<Robot> {
    const { data } = await api.get(`/robots/${id}`);
    return data;
}

export async function create(robot: RobotCreate): Promise<Robot> {
    const { data } = await api.post('/robots', robot);
    return data;
}

export async function update(id: number, robot: RobotUpdate): Promise<Robot> {
    const { data } = await api.put(`/robots/${id}`, robot);
    return data;
}

export async function remove(id: number): Promise<void> {
    await api.delete(`/robots/${id}`);
}

