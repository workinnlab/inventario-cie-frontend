# 📦 Inventario CIE - Frontend

Sistema de gestión de inventario para el **Centro de Innovación Educativa (CIE)**. Una aplicación web moderna para el control de equipos, electrónica, robots, materiales, préstamos y prestatarios.

![Estado](https://img.shields.io/badge/estado-producción-green)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.4-646cff?logo=vite)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Comandos Disponibles](#-comandos-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Autenticación y Roles](#-autenticación-y-roles)
- [API Backend](#-api-backend)
- [Manejo de Errores](#-manejo-de-errores)
- [Buenas Prácticas](#-buenas-prácticas)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎯 Funcionalidades Principales

- **Dashboard Interactivo**: Vista general con estadísticas en tiempo real de todos los módulos
- **Gestión de Equipos de Cómputo**: Control de equipos con código, serial, marca y estado
- **Inventario de Electrónica**: Componentes electrónicos con stock y estado de uso
- **Administración de Robots**: Control de robots disponibles, en uso y fuera de servicio
- **Materiales de Impresión 3D**: Filamentos, resinas y otros materiales con control de cantidad
- **Sistema de Préstamos**: Gestión completa de préstamos con fechas límite y observaciones
- **Prestatarios**: Registro de usuarios que pueden solicitar préstamos
- **Historial de Movimientos**: Auditoría completa de entradas, salidas y ajustes
- **Configuración de Alertas**: Panel de administración para configurar umbrales globales (stock mínimo, días para vencimiento, etc.)

### 🔐 Sistema de Roles

- **Admin**: Acceso completo a todas las funcionalidades
- **Inventory**: Gestión de inventario y préstamos
- **Viewer**: Solo lectura del inventario

### 🎨 Experiencia de Usuario

- **Diseño Responsivo**: Adaptable a móviles, tablets y escritorio
- **Modo Oscuro/Claro**: Toggle de tema con persistencia local
- **Notificaciones Toast**: Feedback visual para todas las acciones
- **Búsqueda y Filtrado**: Búsqueda en tiempo real en todas las tablas
- **Validación de Formularios**: Validación en cliente y servidor
- **Error Handling**: Manejo elegante de errores con reintentos automáticos

---

## 🛠 Tecnologías

### Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2.0 | Framework UI |
| **TypeScript** | 5.3.2 | Tipado estático |
| **Vite** | 5.0.4 | Build tool y dev server |
| **React Router DOM** | 6.20.0 | Enrutamiento |

### Estado y Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **TanStack Query** | 5.10.0 | Gestión de estado del servidor |
| **Context API** | - | Estado global (auth, tema) |

### UI y Estilos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | 3.4.0 | Framework CSS |
| **Lucide React** | 0.300.0 | Iconos |
| **Componentes Custom** | - | UI components propios |

### Utilidades

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Axios** | 1.6.0 | Cliente HTTP |
| **Zod** | 3.22.0 | Validación de esquemas |
| **React Hook Form** | 7.49.0 | Manejo de formularios |
| **clsx + tailwind-merge** | - | Utilidades de clases |

---

## 📋 Requisitos

### Software Necesario

- **Node.js** >= 18.x ([Descargar](https://nodejs.org/))
- **npm** >= 9.x (incluido con Node.js)
- **Git** para clonar el repositorio

### Conocimientos Recomendados

- JavaScript ES6+
- React y hooks
- TypeScript básico
- Tailwind CSS

---

## 📥 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/inventario-cie-frontend.git
cd inventario-cie-frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# API Backend
VITE_API_URL=https://inventario-workinn-api.onrender.com/api/v1
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API backend | `https://inventario-workinn-api.onrender.com/api/v1` |

### Configuración de Vite

El proyecto usa **Vite** con las siguientes configuraciones personalizadas:

- **Alias**: `@` apunta a `./src`
- **Puerto**: 5173
- **Open**: Abre el navegador automáticamente

### Configuración de TypeScript

- **Strict Mode**: Activado
- **Paths**: `@/*` → `./src/*`
- **JSX**: `react-jsx`

---

## 🚀 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Compila para producción (TypeScript + Vite) |
| `npm run preview` | Vista previa del build de producción |

---

## 📁 Estructura del Proyecto

```
Front_inventario_CIE/
├── 📂 public/                 # Archivos estáticos
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 layout/        # Componentes de layout
│   │   │   ├── layout.tsx    # Layout principal
│   │   │   ├── header.tsx    # Header con usuario y tema
│   │   │   ├── sidebar.tsx   # Navegación lateral
│   │   │   └── protected-route.tsx  # Rutas protegidas
│   │   └── 📂 ui/            # Componentes UI reutilizables
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── modal.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       ├── spinner.tsx
│   │       └── toast.tsx
│   │
│   ├── 📂 contexts/          # Contextos de React
│   │   ├── auth-context.tsx  # Autenticación y usuario
│   │   └── theme-context.tsx # Tema claro/oscuro
│   │
│   ├── 📂 hooks/             # Custom hooks
│   │   ├── use-equipos.ts
│   │   ├── use-electronica.ts
│   │   ├── use-robots.ts
│   │   ├── use-materiales.ts
│   │   ├── use-prestatarios.ts
│   │   ├── use-prestamos.ts
│   │   └── use-movimientos.ts
│   │
│   ├── 📂 pages/             # Páginas de la aplicación
│   │   ├── login.tsx
│   │   ├── dashboard.tsx
│   │   ├── equipos.tsx
│   │   ├── electronica.tsx
│   │   ├── robots.tsx
│   │   ├── materiales.tsx
│   │   ├── prestatarios.tsx
│   │   ├── prestamos.tsx
│   │   ├── movimientos.tsx
│   │   └── configuracion.tsx
│   │
│   ├── 📂 services/          # Servicios API
│   │   ├── auth.ts
│   │   ├── equipos.ts
│   │   ├── electronica.ts
│   │   ├── robots.ts
│   │   ├── materiales.ts
│   │   ├── prestatarios.ts
│   │   ├── prestamos.ts
│   │   ├── movimientos.ts
│   │   └── configuracion.ts
│   │
│   ├── 📂 types/             # Tipos TypeScript
│   │   └── index.ts
│   │
│   ├── 📂 utils/             # Utilidades
│   │   ├── cn.ts             # Merge de clases Tailwind
│   │   ├── formatters.ts     # Formateo de fechas y números
│   │   └── error-handler.ts  # Manejo de errores de API
│   │
│   ├── 📂 lib/               # Librerías configuradas
│   │   └── api.ts            # Instancia de Axios
│   │
│   ├── App.tsx               # Componente raíz
│   ├── main.tsx              # Punto de entrada
│   └── index.css             # Estilos globales
│
├── 📄 .env                    # Variables de entorno
├── 📄 .env.example            # Ejemplo de variables
├── 📄 index.html              # HTML base
├── 📄 package.json            # Dependencias y scripts
├── 📄 tsconfig.json           # Configuración TypeScript
├── 📄 vite.config.ts          # Configuración Vite
├── 📄 tailwind.config.js      # Configuración Tailwind
└── 📄 postcss.config.js       # Configuración PostCSS
```

---

## 📦 Módulos del Sistema

### 1. Dashboard

**Propósito**: Vista general del inventario

**Características**:
- Tarjetas con totales por categoría
- Préstamos activos recientes
- Movimientos recientes
- Iconos por categoría

**Ruta**: `/dashboard`

---

### 2. Equipos de Cómputo

**Propósito**: Gestión de computadoras y periféricos

**Campos**:
- `código`: Código único del equipo
- `nombre`: Nombre descriptivo
- `marca`: Fabricante
- `serial`: Número de serie
- `accesorios`: Accesorios incluidos
- `estado`: disponible | en uso | prestado | mantenimiento | dañado

**Ruta**: `/equipos`

---

### 3. Electrónica

**Propósito**: Componentes y módulos electrónicos

**Campos**:
- `nombre`: Nombre del componente
- `descripcion`: Descripción detallada
- `tipo`: Categoría del componente
- `en_stock`: Cantidad disponible
- `en_uso`: Cantidad en uso
- `total`: Suma automática

**Ruta**: `/electronica`

---

### 4. Robots

**Propósito**: Gestión de robots y kits robóticos

**Campos**:
- `nombre`: Nombre del robot
- `disponible`: Cantidad disponible
- `en_uso`: Cantidad en uso
- `fuera_de_servicio`: Cantidad dañada
- `total`: Suma automática

**Ruta**: `/robots`

---

### 5. Materiales

**Propósito**: Insumos para impresión 3D

**Campos**:
- `color`: Color del material
- `categoria`: Filamento | Resina | Otro
- `cantidad`: Cantidad total (ej: 1KG)
- `en_stock`: Disponible
- `en_uso`: En uso
- `usado`: Cantidad usada

**Ruta**: `/materiales`

---

### 6. Prestatarios

**Propósito**: Usuarios autorizados para préstamos

**Campos**:
- `nombre`: Nombre completo
- `cedula`: Documento de identidad
- `dependencia`: Departamento/Área
- `telefono`: Número de contacto
- `email`: Correo electrónico
- `activo`: Estado del prestatario

**Ruta**: `/prestatarios`

---

### 7. Préstamos

**Propósito**: Gestión de préstamos de items

**Campos**:
- `prestatario`: Quién solicita el préstamo
- `item`: Equipo, electrónica, robot o material
- `fecha_prestamo`: Fecha de creación
- `fecha_limite`: Fecha límite de devolución
- `estado`: activo | devuelto | vencido | perdido
- `observaciones`: Notas adicionales

**Ruta**: `/prestamos`

**Funcionalidades**:
- Crear nuevo préstamo
- Devolver item (cambia estado a "devuelto")
- Filtrar por estado
- Buscar por prestatario u observaciones

---

### 8. Movimientos

**Propósito**: Auditoría de todas las transacciones

**Tipos de Movimiento**:
- `entrada`: Ingreso de nuevo item
- `salida`: Salida de item
- `devolucion`: Retorno de préstamo
- `daño`: Item dañado
- `ajuste_stock`: Ajuste de inventario
- `baja`: Item dado de baja
- `transferencia`: Cambio de ubicación

**Campos**:
- `tipo`: Tipo de movimiento
- `item`: Item afectado
- `cantidad`: Cantidad involucrada
- `descripcion`: Descripción del movimiento
- `fecha`: Fecha y hora del movimiento

**Ruta**: `/movimientos`

---

### 9. Configuración

**Propósito**: Administrar parámetros globales y umbrales de alerta del sistema (solo `admin`).

**Características**:
- Tarjetas de configuración con edición en línea
- Actualización automática de alertas del Dashboard
- Soporte para umbrales de stock mínimo, días de préstamos por vencer y alertas de equipos dañados.

**Ruta**: `/configuracion`

---

## 🔐 Autenticación y Roles

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. API valida y devuelve `access_token` + `user`
3. Token se guarda en `localStorage`
4. Usuario es redirigido al dashboard
5. Token se incluye en cada request via header `Authorization: Bearer <token>`

### Roles y Permisos

| Acción | Admin | Inventory | Viewer |
|--------|-------|-----------|--------|
| Ver inventario | ✅ | ✅ | ✅ |
| Crear items | ✅ | ✅ | ❌ |
| Editar items | ✅ | ✅ | ❌ |
| Eliminar items | ✅ | ❌ | ❌ |
| Crear préstamos | ✅ | ✅ | ❌ |
| Devolver préstamos | ✅ | ✅ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |

### Componente ProtectedRoute

```tsx
// Solo admin e inventory pueden acceder
<ProtectedRoute allowedRoles={['admin', 'inventory']}>
  <Equipos />
</ProtectedRoute>
```

---

## 🌐 API Backend

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/logout` | Cerrar sesión |
| GET | `/auth/me` | Obtener usuario actual |
| GET | `/equipos` | Listar equipos |
| POST | `/equipos` | Crear equipo |
| PUT | `/equipos/:id` | Actualizar equipo |
| DELETE | `/equipos/:id` | Eliminar equipo |
| GET | `/prestamos` | Listar préstamos |
| POST | `/prestamos` | Crear préstamo |
| PUT | `/prestamos/:id/devolver` | Devolver préstamo |
| GET | `/movimientos` | Listar movimientos |
| GET | `/configuracion/alertas` | Listar configuraciones globales |
| PUT | `/configuracion/alertas/:clave` | Actualizar configuración específica |

### Formato de Fechas

La API espera fechas en formato **ISO 8601**:

```typescript
// ✅ Correcto
fecha_limite: "2026-03-18T23:59:59"

// ❌ Incorrecto
fecha_limite: "2026-03-18"
```

### Códigos de Error

| Código | Significado |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado |
| 400 | Bad Request |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | No encontrado |
| 422 | Error de validación |
| 500 | Error del servidor |

---

## 🛡 Manejo de Errores

### ErrorBoundary

Componente que captura errores de React y muestra UI amigable:

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Error Handler

Utilitario para extraer mensajes de error de la API:

```typescript
// src/utils/error-handler.ts
export function getErrorMessage(error: any): string {
  // Maneja errores string, objeto, array y de conexión
}
```

### Reintentos Automáticos

TanStack Query reintenta automáticamente 2 veces antes de mostrar error.

### UI de Error en Páginas

Cada página muestra:
- Icono de alerta
- Mensaje descriptivo
- Botón "Intentar de nuevo"

---

## 📚 Buenas Prácticas

### Código

1. **TypeScript estricto**: Todo el código está tipado
2. **Componentes pequeños**: Cada componente hace una cosa
3. **Custom hooks**: Lógica reutilizable en hooks
4. **Nombres descriptivos**: Variables y funciones claras

### Estilos

1. **Tailwind primero**: Usar clases utilitarias
2. **Componentes UI**: Reutilizar componentes base
3. **Responsive**: Mobile-first cuando aplica

### Performance

1. **React Query**: Caché y deduplicación de requests
2. **Lazy loading**: Cargar rutas bajo demanda
3. **Memoización**: Usar `useMemo` y `useCallback` cuando sea necesario

### Seguridad

1. **Tokens en localStorage**: Con interceptor de Axios
2. **Rutas protegidas**: Validar roles en frontend y backend
3. **Logout automático**: Al recibir 401

---

## 🔧 Solución de Problemas

### La aplicación no carga

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Errores de conexión con la API

1. Verificar `VITE_API_URL` en `.env`
2. Verificar que el backend esté corriendo
3. Revisar CORS en el backend

### Errores de TypeScript

```bash
# Verificar errores
npx tsc --noEmit
```

### El build falla

```bash
# Build limpio
rm -rf dist
npm run build
```

### Problemas con el servidor de desarrollo

```bash
# Matar proceso y reiniciar
killall node
npm run dev
```

---

## 🤝 Contribución

### Pasos para Contribuir

1. Fork el repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Convenciones de Commit

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato/estilo
- `refactor:` Refactorización
- `test:` Agregar/modificar tests
- `chore:` Cambios de configuración

---

## 📄 Licencia

Este proyecto es propiedad del **Centro de Innovación Educativa (CIE)** y su uso está restringido a personal autorizado.

---

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo del CIE.

---

## 🙏 Agradecimientos

- **React Team** - Framework UI
- **Vite Team** - Build tool
- **TanStack** - React Query
- **Tailwind Labs** - Framework CSS
- **Lucide** - Iconos

---

**Hecho con ❤️ por el equipo de desarrollo del CIE**
