import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { useTheme } from '@/components/ThemeProvider'
import {
  LayoutDashboard,
  Users,
  Trophy,
  FileText,
  CreditCard,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePagosVencidosCount } from '@/hooks/usePagos'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/socios', label: 'Socios', icon: Users },
  { path: '/admin/deportes', label: 'Deportes', icon: Trophy },
  { path: '/admin/inscripciones', label: 'Inscripciones', icon: FileText },
  { path: '/admin/pagos', label: 'Pagos', icon: CreditCard, badge: 'pagosVencidos' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar, closeSidebar, sidebarCollapsed, toggleCollapsed } = useUIStore()
  const { theme, toggleTheme } = useTheme()

  const { data: pagosVencidos } = usePagosVencidosCount()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const currentPage = navItems.find((item) => location.pathname.startsWith(item.path))?.label
  const initials = (user?.email?.[0] ?? '?').toUpperCase()

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
          'fixed inset-y-0 left-0 z-30 flex w-64 transform flex-col bg-gradient-to-b from-sidebar to-sidebar-accent text-sidebar-foreground shadow-xl transition-[width,transform] duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 border-b border-white/10 px-4 py-4',
            sidebarCollapsed && 'lg:justify-center lg:px-2',
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <img src="/logo.png" alt="GesClub" className="h-7 w-auto" />
          </div>
          <div className={cn('min-w-0 flex-1', sidebarCollapsed && 'lg:hidden')}>
            <h1 className="truncate text-base font-bold leading-tight">GesClub</h1>
            <p className="truncate text-xs opacity-70">Panel de administración</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={closeSidebar}
            className="text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                title={sidebarCollapsed ? item.label : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/15 shadow-sm'
                    : 'opacity-80 hover:bg-white/10 hover:opacity-100',
                  sidebarCollapsed && 'lg:justify-center lg:px-2',
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-foreground" />
                )}
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={cn('flex-1 truncate', sidebarCollapsed && 'lg:hidden')}>
                  {item.label}
                </span>
                {item.badge === 'pagosVencidos' && pagosVencidos > 0 && (
                  <Badge
                    variant="destructive"
                    className={cn(
                      'ml-auto px-1.5 py-0 text-xs',
                      sidebarCollapsed && 'lg:absolute lg:right-1.5 lg:top-1.5 lg:ml-0',
                    )}
                  >
                    {pagosVencidos}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            to="/admin/perfil"
            onClick={closeSidebar}
            title={sidebarCollapsed ? 'Mi perfil' : undefined}
            className={cn(
              'mb-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/10',
              sidebarCollapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
              {initials}
            </span>
            <span className={cn('min-w-0 flex-1', sidebarCollapsed && 'lg:hidden')}>
              <span className="block truncate text-sm font-medium">Mi perfil</span>
              <span className="block truncate text-xs opacity-70">{user?.email}</span>
            </span>
          </Link>

          <div className={cn('flex items-center gap-2', sidebarCollapsed && 'lg:flex-col')}>
            <button
              type="button"
              onClick={toggleCollapsed}
              title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              className="hidden h-9 w-9 items-center justify-center rounded-lg opacity-80 transition-colors hover:bg-white/10 hover:opacity-100 lg:flex"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className={cn(
                'flex h-9 flex-1 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-red-500/25 lg:justify-start',
                sidebarCollapsed && 'lg:justify-center lg:px-0',
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className={cn(sidebarCollapsed && 'lg:hidden')}>Cerrar sesión</span>
            </button>
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
          <div className="ml-auto flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={toggleTheme} className="h-9 w-9" title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
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

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
