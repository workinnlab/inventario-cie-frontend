import api from '@/lib/api';

export interface DashboardResumen {
    fecha: string;
    totales: {
        equipos: number;
        electronica: number;
        robots: number;
        materiales: number;
        prestatarios: number;
        prestamos: number;
    };
    equipos: {
        por_estado: Record<string, number>;
        disponibles: number;
        en_uso: number;
        prestados: number;
        danados: number;
    };
    prestamos: {
        por_estado: Record<string, number>;
        activos: number;
        devueltos: number;
        vencidos: number;
        por_vencer_7_dias: number;
    };
}

export async function getResumen(): Promise<DashboardResumen> {
    const { data } = await api.get('/dashboard/resumen');
    return data;
}

export async function getMovimientosHistorial(dias: number = 30) {
    const { data } = await api.get(`/dashboard/movimientos-historial?dias=${dias}`);
    return data;
}

export async function getTopPrestatarios(limite: number = 10) {
    const { data } = await api.get(`/dashboard/top-prestatarios?limite=${limite}`);
    return data;
}
