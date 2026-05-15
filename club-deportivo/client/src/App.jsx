import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Socios from './pages/Socios'
import Deportes from './pages/Deportes'
import Inscripciones from './pages/Inscripciones'
import Pagos from './pages/Pagos'
import SocioDetail from './pages/SocioDetail'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="flex h-screen items-center justify-center">Cargando...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

export default function App() {
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="socios" element={<Socios />} />
        <Route path="socios/:id" element={<SocioDetail />} />
        <Route path="deportes" element={<Deportes />} />
        <Route path="inscripciones" element={<Inscripciones />} />
        <Route path="pagos" element={<Pagos />} />
      </Route>
    </Routes>
  )
}
