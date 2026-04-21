import type { ReactNode } from 'react';

// ── Auth ──
export interface User {
    id: string;
    email: string;
    nombre: string;
    rol: 'admin' | 'inventory' | 'viewer';
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    nombre: string;
    rol?: 'admin' | 'inventory' | 'viewer';
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: 'bearer';
    user: User;
}

// ── Equipos ──
export interface Equipo {
    id: number;
    nombre: string;
    marca: string;
    codigo: string;
    accesorios?: string;
    serial?: string;
    estado: 'disponible' | 'en uso' | 'prestado' | 'mantenimiento' | 'dañado' | 'arreglado';
    created_at: string;
    updated_at: string;
}

export type EquipoCreate = Omit<Equipo, 'id' | 'created_at' | 'updated_at'>;
export type EquipoUpdate = Partial<EquipoCreate>;

// ── Electrónica ──
export interface Electronica {
    id: number;
    nombre: string;
    descripcion?: string;
    tipo?: string;
    en_uso: number;
    en_stock: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export type ElectronicaCreate = Omit<Electronica, 'id' | 'total' | 'created_at' | 'updated_at'>;
export type ElectronicaUpdate = Partial<ElectronicaCreate>;

// ── Robots ──
export interface Robot {
    id: number;
    nombre: string;
    fuera_de_servicio: number;
    en_uso: number;
    disponible: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export type RobotCreate = Omit<Robot, 'id' | 'total' | 'created_at' | 'updated_at'>;
export type RobotUpdate = Partial<RobotCreate>;

// ── Materiales ──
export interface Material {
    id: number;
    color: string;
    tipo_id?: number;
    cantidad: string;
    categoria: 'Filamento' | 'Resina' | 'Otro';
    usado: number;
    en_uso: number;
    en_stock: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export type MaterialCreate = Omit<Material, 'id' | 'total' | 'created_at' | 'updated_at'>;
export type MaterialUpdate = Partial<MaterialCreate>;

export interface TipoMaterial {
    id: number;
    nombre: string;
}

// ── Prestatarios ──
export interface Prestatario {
    id: number;
    nombre: string;
    telefono?: string;
    dependencia: string;
    cedula?: string;
    email?: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

export type PrestatarioCreate = Omit<Prestatario, 'id' | 'activo' | 'created_at' | 'updated_at'>;
export type PrestatarioUpdate = Partial<PrestatarioCreate & { activo: boolean }>;

// ── Préstamos ──
export interface Prestamo {
    id: number;
    equipo_id?: number;
    electronica_id?: number;
    robot_id?: number;
    material_id?: number;
    prestatario_id: number;
    fecha_prestamo: string;
    fecha_devolucion?: string;
    fecha_limite?: string;
    estado: 'activo' | 'devuelto' | 'vencido' | 'perdido';
    observaciones?: string;
    created_at: string;
    updated_at: string;
}

export interface PrestamoCreate {
    prestatario_id: number;
    equipo_id?: number;
    electronica_id?: number;
    robot_id?: number;
    material_id?: number;
    fecha_limite?: string;
    observaciones?: string;
}

export type PrestamoUpdate = Partial<PrestamoCreate>;

// ── Movimientos ──
export interface Movimiento {
    id: number;
    tipo: 'entrada' | 'salida' | 'devolucion' | 'daño' | 'ajuste_stock' | 'baja' | 'transferencia';
    equipo_id?: number;
    electronica_id?: number;
    robot_id?: number;
    material_id?: number;
    cantidad: number;
    prestamo_id?: string;
    usuario_id?: string;
    usuario_nombre?: string;
    descripcion?: string;
    ubicacion_anterior?: string;
    ubicacion_nueva?: string;
    created_at: string;
}

export interface MovimientoCreate {
    tipo: Movimiento['tipo'];
    equipo_id?: number;
    electronica_id?: number;
    robot_id?: number;
    material_id?: number;
    cantidad: number;
    descripcion?: string;
}

// ── Form Interfaces ──
export interface EquipoForm {
    nombre: string;
    marca: string;
    codigo: string;
    accesorios: string;
    serial: string;
    estado: Equipo['estado'];
}

export interface ElectronicaForm {
    nombre: string;
    descripcion: string;
    tipo: string;
    en_uso: number;
    en_stock: number;
}

export interface RobotForm {
    nombre: string;
    fuera_de_servicio: number;
    en_uso: number;
    disponible: number;
}

export interface MaterialForm {
    color: string;
    tipo_id?: number;
    cantidad: string;
    categoria: Material['categoria'];
    en_stock: number;
    en_uso: number;
}

export interface PrestatarioForm {
    nombre: string;
    telefono: string;
    dependencia: string;
    cedula: string;
    email: string;
}

// ── Table Column Type ──
export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
}
