# AGENTS.md

Convenciones del repo. Leer antes de tocar código.

## Estructura

- `club-deportivo/client` — React 19 + Vite. Estado de servidor con TanStack Query, UI con Zustand.
- `club-deportivo/server` — Node + Express. Datos en Supabase vía el cliente `service_role`. **No hay Prisma en runtime**, aunque siga en `package.json`: todo acceso a datos pasa por `supabase.from(...)` y los errores son los códigos que devuelve Supabase.

## Comandos

```bash
# client
cd club-deportivo/client
pnpm test:run      # vitest
pnpm lint
pnpm build

# server
cd club-deportivo/server
pnpm test:run
```

## Regla de estado: qué va en Zustand y qué en React Query

Es la decisión central del cliente. No es una preferencia de estilo.

**React Query = estado del servidor.** Todo lo que viene de la API: socios, deportes, inscripciones, pagos, debts, portal, dashboard.

**Zustand = estado de UI y sesión.** Solo cosas que son del cliente:
- `stores/authStore.js` — sesión de Supabase (`user`, `session`, `loading`). Es la fuente única: no copies el token a `localStorage`.
- `stores/uiStore.js` — estado puramente visual (sidebar, etc.).

Reglas que se siguen:

- **Nada de store para datos de servidor.** No se agregar un `socioStore` ni un `pagosStore`. El precedente es explícito: uno existió y se eliminó en `5412c77`.
- **Cada endpoint tiene un hook** en `src/hooks/` y la página no llama al service directo.
- **Todo fetch pasa por la invalidación de `queryKeys`.** Una mutation declara qué roots invalida, y las claves de lista cuelgan del root (`['pagos', 'list', params]`) para que la invalidación en cascada funcione. Escribir una `queryFn` a mano dentro de una página está prohibido.
- **El interceptor de `src/lib/api.js` lee el token del store** con `useAuthStore.getState().session`, nunca de `localStorage`. Un 401 llama a `expireSession()` para que el store y la pantalla coincidan.
- **`getApiError()`** es la única forma de sacar un mensaje de error de la API. El contrato del server es `{ error, message? }`.

## Imports

Siempre el alias `@/` o un paquete. Nunca rutas relativas — hay una regla de ESLint (`no-restricted-imports`) que lo bloquea.

```js
import { useSocios } from '@/hooks/useSocios'   // sí
import { cn } from '../lib/utils'                // no
```

## Persistencia

Nada de `localStorage` directo. Usar `@/lib/storage`, que versiona las claves y envuelve el acceso en `try/catch` porque `localStorage` tira en modo privado y cuando se llena la cuota.

## Tests

- Un hook de query/mutation se prueba con un `QueryClient` real vía `renderQueryHook` de `src/test/queryClient.jsx`, no con el `queryKey` hardcodeado. Lo que se rompe en silencio son las invalidaciones, y un test que sólo compara strings no las ejercita.
- Los services se mockean con `vi.mock('@/services')`; `sonner` también.
- `@/lib/supabase` se mockea en los tests de hooks para que no dependan de un `.env` local.
- Los tests del store mockean `@/lib/supabase` entero e interceptan la suscripción de `onAuthStateChange`.

## Server

- Los errores se maplean por código real de Supabase (`error.code`), no por ramas de Prisma que ya no existen.
- Las rutas de lectura de negocio van con `authMiddleware`; las que escriben datos de administración llevan además `requireAdmin`. Al agregar una ruta hay que decidirlo explícitamente.
- Todo controller es `asyncHandler`.
- Las listas devuelven `{ data, pagination }` con `buildPagination`. Ojo: los hooks no las leen igual — `useSocios` devuelve el wrapper y `useDeportes` devuelve el array. Hay tests que fijan esa diferencia a propósito; si se unifica, hay que actualizar ambos.