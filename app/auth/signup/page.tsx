'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('As senhas não correspondem')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/home')
      }, 2000)
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DM</span>
            </div>
            <span className="font-display font-bold text-2xl text-neutral-900">DataMaturity</span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Criar conta</h1>
          <p className="text-neutral-600">Comece sua jornada de maturidade em dados</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">Conta criada com sucesso! Redirecionando...</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 focus:shadow-lg focus:scale-105 hover:border-neutral-400"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 focus:shadow-lg focus:scale-105 hover:border-neutral-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-900 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 focus:shadow-lg focus:scale-105 hover:border-neutral-400"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-900 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 focus:shadow-lg focus:scale-105 hover:border-neutral-400"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-neutral-300 mt-1" required />
              <span className="text-sm text-neutral-600">
                Concordo com os{' '}
                <Link href="/termos" className="text-primary-600 hover:text-primary-700 font-medium">
                  Termos de Serviço
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-medium py-2.5 rounded-lg transition transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Criando conta...' : success ? 'Conta criada!' : 'Criar conta'}
              {!isLoading && !success && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Já tem conta?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/auth/login"
            className="w-full block text-center py-2.5 border border-neutral-300 hover:border-primary-600 text-neutral-900 hover:text-primary-600 font-medium rounded-lg transition"
          >
            Fazer login
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          Protegido por{' '}
          <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Supabase
          </Link>
        </p>
      </div>
    </div>
  )
}
