'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuote, calculateWorkDates } from '@/contexts/QuoteContext'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react'

export default function Step3Summary() {
  const { state } = useQuote()
  const { state: authState } = useAuth()
  const { apiCall } = useApi()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Calcola le date di lavoro se abbiamo una data di inizio
  const workDates = state.formData.workStartDate 
    ? calculateWorkDates(state.services, state.formData.workStartDate)
    : null

  const handleConfirmQuote = async () => {
    if (!authState.isAuthenticated) {
      // Redirect al login se non autenticato
      router.push('/login')
      return
    }

    setSaving(true)
    setError('')

    try {
      const result = await apiCall('/api/quotes', {
        method: 'POST',
        body: JSON.stringify({
          services: state.services,
          addons: state.addons,
          formData: state.formData,
          totals: state.totals
        })
      })

      // Success! Redirect alla dashboard
      router.push(`/dashboard?new_quote=${result.quote.id}`)
      
    } catch (error) {
      console.error('Errore salvataggio preventivo:', error)
      setError(error instanceof Error ? error.message : 'Errore nel salvataggio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Riepilogo Preventivo
        </h2>
        <p className="text-gray-600">
          Controlla tutti i dettagli prima di confermare il preventivo
        </p>
      </div>

      {/* Informazioni Progetto */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          Dettagli Progetto
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Indirizzo</p>
                <p className="text-gray-600">{state.formData.address || 'Non specificato'}</p>
              </div>
            </div>
            
            {state.formData.workStartDate && (
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Data Inizio</p>
                  <p className="text-gray-600">{formatDate(state.formData.workStartDate)}</p>
                </div>
              </div>
            )}
          </div>

          {workDates && (
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Durata Stimata</p>
                  <p className="text-gray-600">
                    {workDates.totalHours} ore ({workDates.workingDays} giorni lavorativi)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Data Fine Stimata</p>
                  <p className="text-gray-600">{formatDate(workDates.endDate)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {state.formData.description && (
          <div className="mt-6 pt-6 border-t">
            <p className="font-medium text-gray-900 mb-2">Note Aggiuntive</p>
            <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
              {state.formData.description}
            </p>
          </div>
        )}
      </div>

      {/* Servizi Selezionati */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔧 Servizi Richiesti ({state.services.length})
        </h3>
        
        <div className="space-y-4">
          {state.services.map(item => (
            <div key={item.service.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-lg mr-3">
                    {item.service.category.name === 'Idraulico' && '🔧'}
                    {item.service.category.name === 'Elettricista' && '⚡'}
                    {item.service.category.name === 'Imbiancatura' && '🎨'}
                    {item.service.category.name === 'Piccole Riparazioni' && '🛠️'}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.service.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.service.category.name} • {formatPrice(item.service.basePrice)} per {item.service.unit}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {item.quantity} {item.service.unit} × {formatPrice(item.service.basePrice)}
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Servizi Aggiuntivi */}
      {state.addons.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⭐ Servizi Aggiuntivi ({state.addons.length})
          </h3>
          
          <div className="space-y-3">
            {state.addons.map(addon => (
              <div key={addon.id} className="flex justify-between items-center py-2">
                <span className="text-gray-900">{addon.name}</span>
                <span className="font-medium text-blue-600">{formatPrice(addon.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totali */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Riepilogo Costi
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Servizi ({state.services.length} elementi):</span>
            <span className="font-medium">{formatPrice(state.totals.servicesTotal)}</span>
          </div>
          
          {state.totals.addonsTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Servizi Aggiuntivi ({state.addons.length} elementi):</span>
              <span className="font-medium">{formatPrice(state.totals.addonsTotal)}</span>
            </div>
          )}
          
          <div className="border-t border-blue-200 pt-3 flex justify-between text-xl font-bold">
            <span className="text-gray-900">Totale Preventivo:</span>
            <span className="text-blue-600">{formatPrice(state.totals.finalTotal)}</span>
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            * Preventivo valido 30 giorni. I prezzi includono manodopera, esclusi materiali dove non specificato.
          </p>
        </div>
      </div>

      {/* Timeline Lavori */}
      {workDates && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📅 Timeline Lavori
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatDate(workDates.startDate)}
              </div>
              <p className="text-sm text-gray-600">Inizio Lavori</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {workDates.workingDays} giorni
              </div>
              <p className="text-sm text-gray-600">Durata Stimata</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatDate(workDates.endDate)}
              </div>
              <p className="text-sm text-gray-600">Fine Lavori</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white border rounded-lg p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Sei soddisfatto del preventivo?
          </h3>
          <p className="text-gray-600">
            {authState.isAuthenticated 
              ? 'Conferma per salvare il preventivo. Riceverai una conferma via email.'
              : 'Accedi o registrati per salvare il preventivo e gestire le tue richieste.'
            }
          </p>
          
          {authState.isAuthenticated ? (
            <Button 
              size="lg" 
              onClick={handleConfirmQuote}
              disabled={saving}
              className="px-8 py-3"
            >
              {saving 
                ? 'Salvataggio in corso...' 
                : `Conferma Preventivo - ${formatPrice(state.totals.finalTotal)}`
              }
            </Button>
          ) : (
            <div className="space-y-3">
              <Button 
                size="lg" 
                onClick={() => router.push('/login')}
                className="px-8 py-3"
              >
                Accedi per Confermare - {formatPrice(state.totals.finalTotal)}
              </Button>
              <p className="text-sm text-gray-500">
                Oppure continua senza account (funzionalità limitata)
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Confermando accetti i nostri termini e condizioni di servizio
          </p>
        </div>
      </div>
    </div>
  )
}