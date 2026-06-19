import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Landing from './pages/public/Landing'
import Registro from './pages/public/Registro'
import ForgotPassword from './pages/public/ForgotPassword'
import ResetPassword from './pages/public/ResetPassword'
import PortalLayout from './pages/portal/PortalLayout'
import PortalDashboard from './pages/portal/PortalDashboard'
import PortalPerfil from './pages/portal/PortalPerfil'
import PortalDeportes from './pages/portal/PortalDeportes'
import PortalPagos from './pages/portal/PortalPagos'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Socios = lazy(() => import('./pages/Socios'))
const Deportes = lazy(() => import('./pages/Deportes'))
const Inscripciones = lazy(() => import('./pages/Inscripciones'))
const Pagos = lazy(() => import('./pages/Pagos'))
const SocioDetail = lazy(() => import('./pages/SocioDetail'))
const Profile = lazy(() => import('./pages/Profile'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" />
  return children
}

function SocioProtectedRoute() {
  const { user, loading } = useAuthStore()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" />
  return <Outlet />
}

export default function App() {
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Socio portal */}
      <Route element={<SocioProtectedRoute />}>
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalDashboard />} />
          <Route path="perfil" element={<PortalPerfil />} />
          <Route path="deportes" element={<PortalDeportes />} />
          <Route path="pagos" element={<PortalPagos />} />
        </Route>
      </Route>

      {/* Admin login */}
      <Route path="/login" element={<Login />} />

      {/* Admin protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
        <Route path="socios" element={<Suspense fallback={<PageLoader />}><Socios /></Suspense>} />
        <Route path="socios/:id" element={<Suspense fallback={<PageLoader />}><SocioDetail /></Suspense>} />
        <Route path="deportes" element={<Suspense fallback={<PageLoader />}><Deportes /></Suspense>} />
        <Route path="inscripciones" element={<Suspense fallback={<PageLoader />}><Inscripciones /></Suspense>} />
        <Route path="pagos" element={<Suspense fallback={<PageLoader />}><Pagos /></Suspense>} />
        <Route path="perfil" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
      </Route>

      {/* Redirect old admin paths */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}