import { Link, useLocation, Outlet } from 'react-router-dom'
import { useSocioStore } from '@/stores/socioStore'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, LogOut, LayoutDashboard, Dumbbell, CreditCard, User } from 'lucide-react'

const navItems = [
  { to: '/portal', label: 'Inicio', icon: LayoutDashboard },
  { to: '/portal/deportes', label: 'Mis Deportes', icon: Dumbbell },
  { to: '/portal/pagos', label: 'Pagos', icon: CreditCard },
  { to: '/portal/perfil', label: 'Perfil', icon: User },
]

function NavLinks({ location, deuda, closeSidebar }) {
  return (
    <>
      {navItems.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            onClick={closeSidebar}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {label === 'Pagos' && deuda?.total > 0 && (
              <Badge variant="destructive" className="ml-1 scale-75">
                {deuda.cantidadMeses}
              </Badge>
            )}
          </Link>
        )
      })}
    </>
  )
}

export default function PortalLayout() {
  const location = useLocation()
  const { socio, deuda } = useSocioStore()
  const { logout: authLogout } = useAuthStore()

  const handleLogout = async () => {
    useSocioStore.getState().logout()
    await authLogout()
    window.location.href = '/portal'
  }

  const initials = `${socio?.nombre?.[0] || ''}${socio?.apellido?.[0] || ''}`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CD</span>
                  </div>
                  <span className="font-bold">Club Deportivo</span>
                </div>
                <nav className="flex flex-col gap-1">
                  <NavLinks location={location} deuda={deuda} closeSidebar={() => {}} />
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/portal" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">CD</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">Club Deportivo</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLinks location={location} deuda={deuda} closeSidebar={() => {}} />
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/portal/perfil">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20 cursor-pointer">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {initials || '?'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}