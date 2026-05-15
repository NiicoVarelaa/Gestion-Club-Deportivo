# Club Deportivo - Sistema de Gestion

Sistema completo para la gestion de un club deportivo. Permite administrar socios, deportes, inscripciones y pagos de cuotas mensuales.

## Tecnologias

### Backend
- **Node.js** + **Express** - API REST
- **Prisma** - ORM para PostgreSQL
- **Zod** - Validaciones
- **Supabase** - Auth + PostgreSQL

### Frontend
- **Vite** + **React** - UI
- **Tailwind CSS** - Estilos
- **Zustand** - State management
- **React Query** - Data fetching
- **React Hook Form** - Formularios
- **Sonner** - Notificaciones
- **React Router** - Routing

## Estructura del Proyecto

```
club-deportivo/
├── server/                    # Backend Express
│   ├── src/
│   │   ├── controllers/       # Logica de negocio
│   │   ├── routes/            # Rutas API
│   │   ├── middleware/        # Auth, error handling
│   │   └── utils/             # Helpers, validaciones
│   └── prisma/
│       └── schema.prisma      # Schema de base de datos
├── client/                    # Frontend React
│   └── src/
│       ├── components/        # Componentes UI
│       ├── pages/             # Paginas
│       ├── stores/            # Zustand stores
│       ├── schemas/           # Zod schemas
│       ├── services/          # API services
│       └── lib/               # Supabase, API client
└── package.json               # Root workspace
```

## Configuracion Inicial

### 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear una cuenta
2. Crear un nuevo proyecto
3. Ir a **Settings > API** y copiar:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_KEY)
4. Ir a **Settings > Database** y copiar el connection string de **Transaction mode (port 6543)**

### 2. Configurar variables de entorno

#### Backend (`server/.env`)

```bash
cp server/.env.example server/.env
```

Editar `server/.env`:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

#### Frontend (`client/.env`)

```bash
cp client/.env.example client/.env
```

Editar `client/.env`:

```env
VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000/api
```

### 3. Instalar dependencias

```bash
npm run install:all
```

### 4. Inicializar base de datos

```bash
npm run db:push
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Endpoints

### Auth
- `POST /api/auth/signup` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Socios
- `GET /api/socios` - Listar socios (query: search, page, limit, activo)
- `GET /api/socios/:id` - Detalle de socio
- `POST /api/socios` - Crear socio
- `PUT /api/socios/:id` - Actualizar socio
- `DELETE /api/socios/:id` - Dar de baja

### Deportes
- `GET /api/deportes` - Listar deportes
- `GET /api/deportes/:id` - Detalle de deporte
- `POST /api/deportes` - Crear deporte
- `PUT /api/deportes/:id` - Actualizar deporte
- `DELETE /api/deportes/:id` - Dar de baja

### Inscripciones
- `GET /api/inscripciones` - Listar inscripciones
- `POST /api/inscripciones` - Inscribir socio a deporte
- `DELETE /api/inscripciones/:id` - Cancelar inscripcion

### Pagos
- `GET /api/pagos` - Listar pagos (query: socioId, estado, mes, anio)
- `POST /api/pagos` - Registrar pago
- `GET /api/pagos/deudas/:socioId` - Obtener deudas de un socio
- `POST /api/pagos/generar` - Generar cuotas del mes
- `GET /api/pagos/dashboard` - Estadisticas del dashboard

## Modelo de Base de Datos

```
Socio
├── id, dni, nombre, apellido, email, telefono
├── fechaNacimiento, fechaAlta, activo

Deporte
├── id, nombre, descripcion, cuotaMensual, activo

Inscripcion
├── id, socioId, deporteId
├── fechaInscripcion, fechaBaja, activo

Pago
├── id, socioId, deporteId, mes, anio
├── monto, fechaPago, estado (PAGADO/PENDIENTE/VENCIDO)
```

## Deploy

### 1. Deploy Backend en Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. New Project > Deploy from GitHub repo
3. Seleccionar el repo
4. Configurar variables de entorno en Railway:
   - `DATABASE_URL` (usar el de Supabase)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `FRONTEND_URL` (URL del frontend deployeado)
   - `NODE_ENV=production`
5. Railway detecta automaticamente el server y hace deploy

### 2. Deploy Frontend en Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. New Project > Import from GitHub
3. Configurar root directory: `client`
4. Configurar variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (URL del backend en Railway)
5. Deploy

### 3. Configurar CORS en el backend

Actualizar `FRONTEND_URL` en el `.env` del backend con la URL de Vercel.

## Comandos Utiles

```bash
# Instalar todo
npm run install:all

# Desarrollo
npm run dev

# Solo backend
npm run dev:server

# Solo frontend
npm run dev:client

# Base de datos
npm run db:push          # Aplicar schema
npm run db:generate      # Generar cliente Prisma
npm run db:studio        # Abrir Prisma Studio (UI)

# Build produccion
npm run build
```

## Funcionalidades

- [x] Autenticacion con Supabase
- [x] CRUD de Socios con busqueda
- [x] CRUD de Deportes
- [x] Inscripcion de socios a deportes
- [x] Registro de pagos
- [x] Calculo automatico de deudas
- [x] Generacion de cuotas mensuales
- [x] Dashboard con estadisticas
- [x] Detalle de socio con estado de cuenta
- [x] Estados de pago: PAGADO, PENDIENTE, VENCIDO
- [x] Sistema de alertas para pagos vencidos
