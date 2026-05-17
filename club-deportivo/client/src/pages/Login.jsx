import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { useTheme } from '../components/ThemeProvider'
import { Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const esLocalization = {
  variables: {
    sign_up: {
      email_label: 'Email',
      password_label: 'Contraseña',
      email_input_placeholder: 'tu@email.com',
      password_input_placeholder: 'Tu contraseña',
      button_label: 'Registrarse',
      loading_button_label: 'Registrando...',
      social_provider_text: 'Ingresar con {{provider}}',
      link_text: '¿No tenes cuenta? Registrate',
      confirmation_text: 'Revisa tu email para el link de confirmacion',
    },
    sign_in: {
      email_label: 'Email',
      password_label: 'Contraseña',
      email_input_placeholder: 'tu@email.com',
      password_input_placeholder: 'Tu contraseña',
      button_label: 'Ingresar',
      loading_button_label: 'Ingresando...',
      social_provider_text: 'Ingresar con {{provider}}',
      link_text: '¿Ya tenes cuenta? Ingresa',
    },
    forgotten_password: {
      email_label: 'Email',
      password_label: 'Contraseña',
      email_input_placeholder: 'tu@email.com',
      button_label: 'Enviar instrucciones',
      loading_button_label: 'Enviando...',
      link_text: '¿Olvidaste tu contraseña?',
      confirmation_text: 'Revisa tu email para el link de recuperacion',
    },
    update_password: {
      password_label: 'Nueva contraseña',
      password_input_placeholder: 'Tu nueva contraseña',
      button_label: 'Actualizar',
      loading_button_label: 'Actualizando...',
      confirmation_text: 'Contraseña actualizada correctamente',
    },
  },
}

export default function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuthStore()
  const { theme } = useTheme()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Club Deportivo</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sistema de Gestion</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceso al Club</CardTitle>
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
              theme={theme === 'dark' ? 'dark' : 'light'}
              providers={[]}
              redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
              magicLink={false}
              onlyThirdPartyProviders={false}
              localization={esLocalization}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
