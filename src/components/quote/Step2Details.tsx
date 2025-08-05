'use client'

import { useState, useEffect } from 'react'
import { useQuote } from '@/contexts/QuoteContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice } from '@/lib/utils'
import { AddonService } from '@/types'

export default function Step2Details() {
  const { state, dispatch } = useQuote()
  const [addons, setAddons] = useState<AddonService[]>([])
  const [loading, setLoading] = useState(true)

  // Carica addon applicabili alle categorie selezionate
  useEffect(() => {
    const categoryIds = Array.from(
      new Set(state.services.map(item => item.service.categoryId))
    )
    
    const url = categoryIds.length > 0 
      ? `/api/addons?categoryIds=${categoryIds.join(',')}`
      : '/api/addons'
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAddons(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Errore caricamento addon:', err)
        setLoading(false)
      })
  }, [state.services])

  const handleFormChange = (field: string, value: string | Date) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      data: { [field]: value }
    })
  }

  const toggleAddon = (addon: AddonService) => {
    const isSelected = state.addons.some(a => a.id === addon.id)
    if (isSelected) {
      dispatch({ type: 'REMOVE_ADDON', addonId: addon.id })
    } else {
      dispatch({ type: 'ADD_ADDON', addon })
    }
  }

  const isAddonSelected = (addonId: string) => {
    return state.addons.some(addon => addon.id === addonId)
  }

  // Data minima: domani
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dettagli del Lavoro
        </h2>
        <p className="text-gray-600">
          Specifica dove e quando vuoi che vengano eseguiti i lavori
        </p>
      </div>

      {/* Riepilogo servizi selezionati */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Servizi Selezionati
        </h3>
        <div className="space-y-2">
          {state.services.map(item => (
            <div key={item.service.id} className="flex justify-between text-sm">
              <span>
                {item.service.name} x{item.quantity} {item.service.unit}
              </span>
              <span className="font-medium">
                {formatPrice(item.totalPrice)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Subtotale Servizi:</span>
            <span>{formatPrice(state.totals.servicesTotal)}</span>
          </div>
        </div>
      </div>

      {/* Form dettagli */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indirizzo del Lavoro *
          </label>
          <Input
            placeholder="Via Roma 123, Milano MI"
            value={state.formData.address}
            onChange={(e) => handleFormChange('address', e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Inserisci l'indirizzo completo dove devono essere eseguiti i lavori
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Inizio Lavori *
          </label>
          <Input
            type="date"
            min={minDate}
            value={state.formData.workStartDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleFormChange('workStartDate', new Date(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Seleziona quando vuoi iniziare i lavori (minimo domani)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Aggiuntive
          </label>
          <Textarea
            placeholder="Descrivi eventuali dettagli specifici, accessi particolari, orari preferiti..."
            value={state.formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
      </div>

      {/* Servizi Addon */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Servizi Aggiuntivi
          </h3>
          <p className="text-gray-600 text-sm">
            Aggiungi servizi extra per migliorare la tua esperienza
          </p>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">Caricamento servizi aggiuntivi...</p>
          </div>
        ) : addons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addons.map(addon => (
              <div
                key={addon.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isAddonSelected(addon.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => toggleAddon(addon)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isAddonSelected(addon.id)}
                        onChange={() => toggleAddon(addon)}
                        className="mr-3"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{addon.name}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {formatPrice(addon.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nessun servizio aggiuntivo disponibile</p>
          </div>
        )}

        {state.addons.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Servizi Aggiuntivi Selezionati:
            </h4>
            <div className="space-y-1">
              {state.addons.map(addon => (
                <div key={addon.id} className="flex justify-between text-sm">
                  <span>{addon.name}</span>
                  <span className="font-medium">{formatPrice(addon.price)}</span>
                </div>
              ))}
              <div className="border-t pt-1 flex justify-between font-semibold text-blue-900">
                <span>Totale Addon:</span>
                <span>{formatPrice(state.totals.addonsTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Totale parziale */}
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Servizi:</span>
            <span>{formatPrice(state.totals.servicesTotal)}</span>
          </div>
          {state.totals.addonsTotal > 0 && (
            <div className="flex justify-between">
              <span>Servizi Aggiuntivi:</span>
              <span>{formatPrice(state.totals.addonsTotal)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Totale:</span>
            <span className="text-blue-600">{formatPrice(state.totals.finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}