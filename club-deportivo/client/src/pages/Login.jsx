import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Club Deportivo</h1>
          <p className="mt-2 text-gray-600">Sistema de Gestion</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesion</CardTitle>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#2563eb',
                      brandAccent: '#1d4ed8',
                    },
                  },
                },
                className: {
                  container: 'auth-container',
                  button: 'auth-button',
                  input: 'auth-input',
                },
              }}
              theme="light"
              providers={[]}
              redirectTo={window.location.origin}
              magicLink={false}
              onlyThirdPartyProviders={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
