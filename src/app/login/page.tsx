'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'

interface LoginForm {
  email: string
  password: string
}

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

  const loginForm = useForm<LoginForm>()
  const registerForm = useForm<RegisterForm>()

  const onLogin = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    
    const result = await login(data.email, data.password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Errore durante il login')
    }
    
    setLoading(false)
  }

  const onRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      setError('Le password non coincidono')
      return
    }

    setLoading(true)
    setError('')
    
    const result = await register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password
    })
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Errore durante la registrazione')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Accedi al tuo account' : 'Crea un account'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? 'Accedi per gestire i tuoi preventivi' 
              : 'Registrati per salvare i tuoi preventivi'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Toggle Login/Register */}
          <div className="flex mb-6">
            <Button
              variant={isLogin ? 'default' : 'outline'}
              onClick={() => setIsLogin(true)}
              className="flex-1 mr-2"
            >
              Accedi
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'outline'}
              onClick={() => setIsLogin(false)}
              className="flex-1 ml-2"
            >
              Registrati
            </Button>
          </div>

          {isLogin ? (
            /* Login Form */
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  {...loginForm.register('email', { required: 'Email obbligatoria' })}
                  className="mt-1"
                  placeholder="mario.rossi@email.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  {...loginForm.register('password', { required: 'Password obbligatoria' })}
                  className="mt-1"
                  placeholder="••••••••"
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome *
                  </label>
                  <Input
                    {...registerForm.register('firstName', { required: 'Nome obbligatorio' })}
                    className="mt-1"
                    placeholder="Mario"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cognome *
                  </label>
                  <Input
                    {...registerForm.register('lastName', { required: 'Cognome obbligatorio' })}
                    className="mt-1"
                    placeholder="Rossi"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <Input
                  type="email"
                  {...registerForm.register('email', { required: 'Email obbligatoria' })}
                  className="mt-1"
                  placeholder="mario.rossi@email.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefono
                </label>
                <Input
                  type="tel"
                  {...registerForm.register('phone')}
                  className="mt-1"
                  placeholder="+39 333 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <Input
                  type="password"
                  {...registerForm.register('password', { 
                    required: 'Password obbligatoria',
                    minLength: { value: 6, message: 'Minimo 6 caratteri' }
                  })}
                  className="mt-1"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Conferma Password *
                </label>
                <Input
                  type="password"
                  {...registerForm.register('confirmPassword', { required: 'Conferma password obbligatoria' })}
                  className="mt-1"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Registrazione in corso...' : 'Registrati'}
              </Button>
            </form>
          )}

          <div className="mt-6">
            <div className="text-center text-sm text-gray-600">
              {isLogin ? "Non hai un account? " : "Hai già un account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Registrati qui' : 'Accedi qui'}
              </button>
            </div>
          </div>

          {/* Login di test */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Per test veloce:</p>
              <p className="text-xs text-gray-500">
                Email: test@example.com<br/>
                Password: password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}