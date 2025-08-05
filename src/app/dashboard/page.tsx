'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import { Quote } from '@/types'
import Link from 'next/link'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Plus,
  Eye
} from 'lucide-react'

function DashboardContent() {
  const { state: authState } = useAuth()
  const { apiCall } = useApi()
  const searchParams = useSearchParams()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const newQuoteId = searchParams.get('new_quote')

  useEffect(() => {
    if (authState.isAuthenticated) {
      loadQuotes()
    }
  }, [authState.isAuthenticated])

  const loadQuotes = async () => {
    try {
      const data = await apiCall('/api/quotes')
      setQuotes(data)
    } catch (error) {
      console.error('Errore caricamento preventivi:', error)
      setError('Errore nel caricamento dei preventivi')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <AlertCircle className="h-5 w-5 text-gray-500" />
      case 'PENDING': return <Clock className="h-5 w-5 text-yellow-500" />
      case 'APPROVED': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'REJECTED': return <XCircle className="h-5 w-5 text-red-500" />
      case 'COMPLETED': return <CheckCircle className="h-5 w-5 text-blue-500" />
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Bozza'
      case 'PENDING': return 'In Attesa'
      case 'APPROVED': return 'Approvato'
      case 'REJECTED': return 'Rifiutato'
      case 'COMPLETED': return 'Completato'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accesso Richiesto
          </h1>
          <p className="text-gray-600 mb-6">
            Devi essere autenticato per accedere alla dashboard
          </p>
          <Link href="/login">
            <Button>Accedi</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Benvenuto, {authState.user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Gestisci i tuoi preventivi e richieste di servizio
              </p>
            </div>
            <Link href="/preventivo">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Preventivo
              </Button>
            </Link>
          </div>
        </div>

        {/* Success message per nuovo preventivo */}
        {newQuoteId && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Preventivo creato con successo! 
              </span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Il tuo preventivo è stato salvato e verrà elaborato a breve.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totale Preventivi</p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quotes.filter(q => q.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approvati</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quotes.filter(q => q.status === 'APPROVED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valore Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(quotes.reduce((sum, q) => sum + Number(q.totalAmount), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista Preventivi */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              I Tuoi Preventivi
            </h2>
          </div>

          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessun preventivo ancora
              </h3>
              <p className="text-gray-600 mb-6">
                Crea il tuo primo preventivo per iniziare
              </p>
              <Link href="/preventivo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crea Preventivo
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <div key={quote.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getStatusIcon(quote.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                        <span className="ml-4 text-sm text-gray-500">
                          Creato il {formatDate(new Date(quote.createdAt))}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="truncate">{quote.address}</span>
                        </div>
                        
                        {quote.workStartDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Inizio: {formatDate(new Date(quote.workStartDate))}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <span>{quote.items.length} servizi</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Servizi: {quote.items.map(item => item.service.name).join(', ')}
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {formatPrice(Number(quote.totalAmount))}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        Dettagli
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}