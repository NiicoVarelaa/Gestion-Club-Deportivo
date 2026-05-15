import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import {
  LayoutDashboard,
  Users,
  Trophy,
  FileText,
  CreditCard,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/socios', label: 'Socios', icon: Users },
  { path: '/deportes', label: 'Deportes', icon: Trophy },
  { path: '/inscripciones', label: 'Inscripciones', icon: FileText },
  { path: '/pagos', label: 'Pagos', icon: CreditCard },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const currentPage = navItems.find((item) => location.pathname.startsWith(item.path))?.label

  return (
    <div className="flex h-dvh bg-muted/40">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 transform border-r bg-background shadow-sm transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h1 className="text-xl font-bold text-primary">Club Deportivo</h1>
            <Button size="icon" variant="ghost" onClick={closeSidebar} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t px-3 py-4">
            <div className="mb-3 truncate px-3 text-sm text-muted-foreground">
              {user?.email}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesion
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b bg-background px-4 py-3 sm:px-6 sm:py-4">
          <Button size="icon" variant="ghost" onClick={toggleSidebar} className="lg:hidden shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
          {currentPage && (
            <span className="text-sm font-medium text-muted-foreground lg:hidden">{currentPage}</span>
          )}
          <div className="ml-auto">
            <span className="hidden text-xs text-muted-foreground sm:block sm:text-sm">
              {new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
