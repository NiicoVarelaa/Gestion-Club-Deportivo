# GesClub — Sistema de Gestión Deportiva

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49-3FCF8E?logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748?logo=prisma)](https://www.prisma.io/)
[![pnpm](https://img.shields.io/badge/pnpm-11.1-F69220?logo=pnpm)](https://pnpm.io/)
[![Zod](https://img.shields.io/badge/Zod-3.24-3E67B3)](https://zod.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer)](https://www.framer.com/motion/)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel)](https://vercel.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?logo=vitest)](https://vitest.dev/)

Sistema full-stack para administrar un club deportivo. Incluye **landing page pública** con animaciones, **registro de socios**, **portal del socio** para consultar deportes y pagos, y **panel de administración** completo con dashboard, CRUD y estadísticas.

## Live Demo

| Entorno | URL |
| ------- | --- |
| Frontend | [gestion-club-deportivo.vercel.app](https://gestion-club-deportivo.vercel.app) |
| Backend | [gestion-club-deportivo.onrender.com](https://gestion-club-deportivo.onrender.com) |

> El backend en Render free tier entra en sleep después de 15 min de inactividad. La primera solicitud puede tardar 30-50s en despertar.

---

## Screenshots

> Las capturas de **Desktop** muestran el panel de administración en modo Light y Dark.
> Las capturas de **Mobile** muestran la experiencia responsive en dispositivo móvil.

---

### Landing Page

| Desktop | Mobile |
|:-------:|:------:|
| — | ![Landing Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Landing-Page-Mobile.png) |

---

### Login

| Desktop | Mobile |
|:-------:|:------:|
| — | ![Login Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Login-Mobile.png) |

---

### Registro Público

| Desktop | Mobile |
|:-------:|:------:|
| — | ![Registro Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Registro-Mobile.png) |

---

### Dashboard

| Light | Dark | Mobile |
|:-----:|:----:|:------:|
| ![Dashboard Light](./screenshots/Club%20Deportes%20-%20Desktop/Dashboard-Desktop-Light.png) | ![Dashboard Dark](./screenshots/Club%20Deportes%20-%20Desktop/Dashboard-Desktop-Dark.png) | ![Dashboard Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Dashboard-Mobile.png) |

---

### Socios

| Light | Dark | Mobile |
|:-----:|:----:|:------:|
| ![Socios Light](./screenshots/Club%20Deportes%20-%20Desktop/Socios-Desktop-Light.png) | ![Socios Dark](./screenshots/Club%20Deportes%20-%20Desktop/Socios-Desktop-Dark.png) | ![Socios Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Socios-Mobile.png) |

---

### Deportes

| Light | Dark | Mobile |
|:-----:|:----:|:------:|
| ![Deportes Light](./screenshots/Club%20Deportes%20-%20Desktop/Deportes-Desktop-Light.png) | ![Deportes Dark](./screenshots/Club%20Deportes%20-%20Desktop/Deportes-Desktop-Dark.png) | ![Deportes Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Deportes-Mobile.png) |

---

### Inscripciones

| Light | Dark | Mobile |
|:-----:|:----:|:------:|
| ![Inscripciones Light](./screenshots/Club%20Deportes%20-%20Desktop/Inscripciones-Desktop-Light.png) | ![Inscripciones Dark](./screenshots/Club%20Deportes%20-%20Desktop/Inscripciones-Desktop-Dark.png) | ![Inscripciones Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Inscripciones-Mobile.png) |

---

### Pagos

| Light | Dark | Mobile |
|:-----:|:----:|:------:|
| ![Pagos Light](./screenshots/Club%20Deportes%20-%20Desktop/Pagos-Desktop-Light.png) | ![Pagos Dark](./screenshots/Club%20Deportes%20-%20Desktop/Pagos-Desktop-Dark.png) | ![Pagos Mobile](./screenshots/Club%20Deportes%20-%20Mobile/Pagos-Mobile.png) |

---

## Funcionalidades

### Público
- **Landing page** con hero animado, grilla de disciplinas destacadas y sección de beneficios
- **Formulario de registro** con validación Zod + React Hook Form, feedback visual de errores
- **Animaciones** con Framer Motion: staggered cards, parallax nav, hover effects, scroll-triggered reveals

### Portal del Socio
- Dashboard personal con estado de cuenta, deportes activos, progreso de pagos y alerta de deudas
- Vista de mis deportes con fecha de inscripción y cuota mensual
- Historial de pagos con estados PAGADO/PENDIENTE/VENCIDO y progreso anual
- Perfil con datos personales y estado de membresía
- Navegación responsive con Sheet (menú lateral) en mobile

### Panel de Administración
- Autenticación completa con Supabase Auth (login/registro/recupero de password)
- CRUD de **Socios**, **Deportes**, **Inscripciones** y **Pagos**
- Búsqueda con debounce (300ms), paginación numerada, skeleton loaders y estados vacíos
- Dashboard con gráficos interactivos (Recharts): torta de estados de pago, barras de recaudación mensual
- Estados de pago: `PAGADO`, `PENDIENTE`, `VENCIDO` con badge de deudas en sidebar
- Generación automática de cuotas mensuales (un click)
- Exportación a **PDF** (jsPDF + autotable) y **Excel** (xlsx)
- Tema oscuro persistiendo en `localStorage`
- Perfil de usuario editable (nombre/apellido/cambio de password)
- Lazy loading por ruta con `React.lazy` + `Suspense`
- Totalmente responsive (mobile-first)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                      Vercel                         │
│  ┌───────────────────────────────────────────────┐  │
│  │         React SPA (Vite + pnpm)               │  │
│  │  Landing / Portal Socio / Admin Panel         │  │
│  │  Zustand / React Query / Framer Motion        │  │
│  └───────────────────┬───────────────────────────┘  │
└──────────────────────┼──────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────┐
│                      Render                          │
│  ┌────────────────────────────────────────────────┐  │
│  │         Express API (Node.js)                  │  │
│  │  Prisma / Zod / Pino / Helmet / CORS           │  │
│  │  Auth + Portal + Admin endpoints               │  │
│  └────────────────────┬───────────────────────────┘  │
└───────────────────────┼─────────────────────────────┘
                        │ SQL
                        ▼
┌──────────────────────────────────────────────────────┐
│                 Supabase (PostgreSQL)                 │
│        Auth + Base de datos + Row Level Security      │
└──────────────────────────────────────────────────────┘
```

### Stack Detallado

| Capa | Tecnología |
| ---- | ---------- |
| Runtime | Node.js 20+ |
| API | Express 4.21 + cors + helmet + compression + rate-limit |
| ORM | Prisma 6.5 (PostgreSQL) |
| Validación | Zod 3.24 (server + client) |
| Auth | Supabase Auth + `@supabase/auth-ui-react` |
| Frontend | React 18.3 + Vite 8 + Tailwind CSS 3.4 |
| Estado | Zustand 5 + React Query 5 |
| Formularios | React Hook Form 7 + `@hookform/resolvers` |
| Animaciones | Framer Motion 12 |
| UI | shadcn/ui + Radix primitives + Lucide React |
| Gráficos | Recharts 3.8 |
| Export | jsPDF 4.2 + xlsx 0.18 |
| Logging | Pino + pino-http (estructurado) |
| Testing | Vitest 4.1 + Testing Library |
| Monorepo | pnpm workspaces 11.1 |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Estructura del Proyecto

```
club-deportivo/
├── server/                          # Backend Express
│   ├── prisma/
│   │   └── schema.prisma            # Modelo de datos
│   ├── src/
│   │   ├── index.js                 # Servidor principal + graceful shutdown
│   │   ├── controllers/             # socios, deportes, pagos, auth, portal
│   │   ├── routes/                  # auth, socios, deportes, pagos, portal
│   │   ├── middleware/              # asyncHandler, autenticación, roles, errores
│   │   └── utils/                   # validaciones Zod, Supabase client, logger
│   ── tests/
│       └── validations.test.js      # Tests de esquemas Zod
├── client/                          # Frontend React
│   ├── src/
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.jsx                  # Router (public + portal + admin)
│   │   ├── pages/
│   │   │   ├── public/              # Landing, Registro
│   │   │   ├── portal/              # PortalDashboard, PortalPerfil, PortalDeportes, PortalPagos
│   │   │   └── *.jsx                # Admin pages (Dashboard, Socios, etc.)
│   │   ├── components/
│   │   │   ├── landings/            # HeroSection, SportsGrid, BenefitsSection
│   │   │   ├── ui/                  # shadcn/ui (15 componentes)
│   │   │   └── *.jsx                # Layout, Modal, Skeleton, Pagination, etc.
│   │   ├── stores/                  # authStore, socioStore, uiStore
│   │   ├── schemas/                 # Zod schemas + tests
│   │   ├── services/                # API services (socios, deportes, pagos, public, portal)
│   │   ├── hooks/                   # useDebounce + tests
│   │   └── lib/                     # api client, supabase, utils, export
│   ── public/
│       └── favicon.svg
├── screenshots/                     # Capturas para portfolio
├── package.json                     # pnpm workspace root + overrides
├── pnpm-workspace.yaml
└── .npmrc
```

---

## Rutas

### Públicas
| Ruta | Descripción |
| ---- | ----------- |
| `/` | Landing page con hero + disciplinas |
| `/registro` | Formulario de inscripción |

### Portal del Socio (requiere auth)
| Ruta | Descripción |
| ---- | ----------- |
| `/portal` | Dashboard personal |
| `/portal/deportes` | Mis deportes inscriptos |
| `/portal/pagos` | Historial y estado de pagos |
| `/portal/perfil` | Datos personales |

### Panel de Administración (requiere auth + role: admin)
| Ruta | Descripción |
| ---- | ----------- |
| `/login` | Login de administrador |
| `/admin/dashboard` | Dashboard con estadísticas |
| `/admin/socios` | Gestión de socios |
| `/admin/deportes` | Gestión de deportes |
| `/admin/inscripciones` | Gestión de inscripciones |
| `/admin/pagos` | Gestión de pagos |
| `/admin/perfil` | Perfil del administrador |

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `POST` | `/api/auth/signup` | Registro admin |
| `POST` | `/api/auth/signup-public` | Registro público (socio) |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |

### Portal del Socio (auth requerida)
| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/portal/me` | Datos del socio logueado |

### Socios (admin)
| Método | Ruta | Descripción | Query params |
| ------ | ---- | ----------- | ------------ |
| `GET` | `/api/socios` | Listar socios | `search`, `page`, `limit` |
| `GET` | `/api/socios/:id` | Detalle de socio | — |
| `POST` | `/api/socios` | Crear socio | — |
| `PUT` | `/api/socios/:id` | Actualizar socio | — |
| `DELETE` | `/api/socios/:id` | Dar de baja | — |

### Deportes
| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/deportes` | Listar deportes |
| `GET` | `/api/deportes/:id` | Detalle de deporte |
| `POST` | `/api/deportes` | Crear deporte |
| `PUT` | `/api/deportes/:id` | Actualizar deporte |
| `DELETE` | `/api/deportes/:id` | Dar de baja |

### Inscripciones (admin)
| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/inscripciones` | Listar inscripciones |
| `POST` | `/api/inscripciones` | Inscribir socio |
| `DELETE` | `/api/inscripciones/:id` | Cancelar inscripción |

### Pagos (admin)
| Método | Ruta | Descripción | Query params |
| ------ | ---- | ----------- | ------------ |
| `GET` | `/api/pagos` | Listar pagos | `socioId`, `estado`, `mes`, `anio` |
| `POST` | `/api/pagos` | Registrar pago | — |
| `GET` | `/api/pagos/deudas/:id` | Deudas de un socio | — |
| `POST` | `/api/pagos/generar` | Generar cuotas del mes | — |
| `GET` | `/api/pagos/dashboard` | Stats del dashboard | — |

### Health
| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/health` | Estado del servidor + conexión DB |

---

## Modelo de Base de Datos

```
┌──────────────────────────────────────────────────────────┐
│  Socio                                                    │
│  id | dni | nombre | apellido | email | telefono         │
│  fechaNacimiento | fechaAlta | activo | supabaseUserId   │
│                                                           │
│  hasMany: Inscripcion, Pago                               │
└───────────────────┬──────────────────────────────────────┘
                    │
───────────────────▼──────────────┐
│  Inscripcion                     │
│  id | socioId | deporteId       │
│  fechaInscripcion | fechaBaja   │
│  activo                          │
│                                  │
│  belongsTo: Socio, Deporte       │
└───────────────────┬──────────────┘
                    │
┌───────────────────▼──────────────┐
│  Deporte                         │
│  id | nombre | descripcion      │
│  cuotaMensual | activo           │
│                                  │
│  hasMany: Inscripcion, Pago      │
└───────────────────┬──────────────┘
                    │
┌───────────────────▼──────────────
│  Pago                            │
│  id | socioId | deporteId       │
│  mes | anio | monto              │
│  fechaPago | estado              │
│                                  │
│  belongsTo: Socio, Deporte       │
──────────────────────────────────┘
```

---

## Desarrollo Local

### Requisitos

- **Node.js** 20+
- **pnpm** 11+
- Cuenta en **[Supabase](https://supabase.com)** (gratuita)

### 1. Clonar

```bash
git clone <repo-url>
cd club-deportivo
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar Supabase

Crear un proyecto en [supabase.com](https://supabase.com) y copiar las credenciales desde **Settings > API**:

| Variable | Dónde encontrarla |
| -------- | ----------------- |
| `SUPABASE_URL` | `Project URL` |
| `SUPABASE_ANON_KEY` | `anon public` key |
| `SUPABASE_SERVICE_KEY` | `service_role` key (secret) |

Luego obtener el **connection string** desde **Settings > Database > Connection string** (modo Transaction, puerto 6543).

### 4. Variables de entorno

#### Backend (`server/.env`)

```bash
cp server/.env.example server/.env
```

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
```

#### Frontend (`client/.env`)

```bash
cp client/.env.example client/.env
```

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_API_URL=http://localhost:3000/api
```

### 5. Sincronizar base de datos

```bash
pnpm db:push
```

### 6. Iniciar desarrollo

```bash
pnpm dev
```

| Servicio | URL |
| -------- | --- |
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| API Proxy | `/api` → `localhost:3000` |

---

## Comandos

```bash
# Desarrollo
pnpm dev                 # Inicia frontend + backend
pnpm -F server dev       # Solo backend
pnpm -F client dev       # Solo frontend

# Build
pnpm build               # Build de producción (frontend)

# Base de datos
pnpm db:generate         # Generar Prisma Client
pnpm db:push             # Sincronizar schema a Supabase
pnpm db:migrate          # Crear migración

# Tests
pnpm -F server test:run  # Tests del backend (19 tests)
pnpm -F client test:run  # Tests del frontend (25 tests)

# Lint
pnpm -F client lint      # ESLint
```

---

## Tests

| Paquete | Tests | Framework | Descripción |
| ------- | ----- | --------- | ----------- |
| `server` | 19 | Vitest | Validaciones Zod (socios, deportes, pagos) |
| `client` | 25 | Vitest | Zod schemas + hook `useDebounce` + integración |

```bash
pnpm -F server test:run   # 19 passed
pnpm -F client test:run   # 25 passed
```

---

## Deploy

El proyecto está configurado para deploy automático al pushear a `main`.

| Entorno | Plataforma | Rama | Comando |
| ------- | ---------- | ---- | ------- |
| Backend | Render | `main` | `pnpm -F gesclub-server start` |
| Frontend | Vercel | `main` | detecta `client/` automáticamente |

### Configuración de Supabase para producción

En el dashboard de Supabase, ir a **Authentication > URL Configuration**:

| Campo | Valor |
| ----- | ----- |
| Site URL | `https://gestion-club-deportivo.vercel.app` |
| Redirect URLs | `https://gestion-club-deportivo.vercel.app` |

---

## Scripts (root)

```json
{
  "dev": "concurrently \"pnpm -F server dev\" \"pnpm -F client dev\"",
  "build": "pnpm -F client build",
  "db:generate": "pnpm -F server db:generate",
  "db:migrate": "pnpm -F server db:migrate",
  "db:push": "pnpm -F server db:push",
  "db:studio": "pnpm -F server db:studio"
}
```

---

## Decisiones Técnicas

- **React 18.3** (no 19): `@supabase/auth-ui-react` no soporta React 19 aún
- **pnpm 11.1** pineado en `package.json` con `packageManager` para compatibilidad con Vercel
- **Prisma** como ORM por type-safety y migraciones; Supabase para queries runtime
- **Framer Motion** para animaciones de la landing (staggered reveals, hover effects, parallax nav)
- **Pino** para logging estructurado en producción (JSON), pretty-print en desarrollo
- **Compression** middleware para gzip automático de responses
- **Graceful shutdown** con cierre de HTTP server y timeout de 10s
- Todas las rutas de API montadas bajo `/api/`
- **Sanitización HTML** en todos los inputs de texto vía Zod transforms
- **Role-based access**: middleware `requireAdmin` verifica `user_metadata.role`
- **Tema oscuro**: implementación propia via `ThemeProvider` + `localStorage`
- **`service_role` key** solo en backend; el frontend usa `anon` key
- **Lazy loading** en todas las rutas con `React.lazy` + `Suspense`
- **Portal del socio** separado del admin: mismo auth, diferente UI y permisos
- **Featured sports cards**: 3 disciplinas principales con datos dinámicos desde la API
