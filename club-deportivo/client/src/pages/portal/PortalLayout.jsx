import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useSocioStore } from '@/stores/socioStore'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'
import { Menu, X, LogOut, LayoutDashboard, Dumbbell, CreditCard, User, Sun, Moon } from 'lucide-react'

const navItems = [
  { to: '/portal', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/portal/deportes', label: 'Mis Deportes', icon: Dumbbell },
  { to: '/portal/pagos', label: 'Pagos', icon: CreditCard },
  { to: '/portal/perfil', label: 'Perfil', icon: User },
]

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { socio, deuda } = useSocioStore()
  const { logout: authLogout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    useSocioStore.getState().logout()
    await authLogout()
    window.location.href = '/portal'
  }

  const closeSidebar = () => setSidebarOpen(false)
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  const initials = `${socio?.nombre?.[0] || ''}${socio?.apellido?.[0] || ''}`

  const currentPage = navItems.find(
    (item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to))
  )?.label

  const isActive = (item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)

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
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <Link to="/portal" className="flex items-center gap-2">
              <img src="/logo.png" alt="GesClub" className="h-7 w-auto" />
              <span className="font-bold text-base">GesClub</span>
            </Link>
            <Button size="icon" variant="ghost" onClick={closeSidebar} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const active = isActive(item)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Pagos' && deuda?.total > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0">
                      {deuda.cantidadMeses}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="border-t px-3 py-4">
            <div className="flex items-center gap-3 mb-3 px-3">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {initials || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="truncate min-w-0">
                <p className="text-sm font-medium truncate">
                  {socio?.nombre ? `${socio.nombre} ${socio.apellido || ''}` : 'Socio'}
                </p>
                <p className="text-xs text-muted-foreground truncate">{socio?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
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
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <Outlet />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
