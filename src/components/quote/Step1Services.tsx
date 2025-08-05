'use client'

import { useState, useEffect } from 'react'
import { useQuote } from '@/contexts/QuoteContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { Service } from '@/types'
import { Plus, Minus, Trash2 } from 'lucide-react'

export default function Step1Services() {
  const { state, dispatch } = useQuote()
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Carica servizi
  useEffect(() => {
    const url = selectedCategory === 'all' 
      ? '/api/services' 
      : `/api/services?categoria=${selectedCategory}`
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setServices(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Errore:', err)
        setLoading(false)
      })
  }, [selectedCategory])

  const addToCart = (service: Service) => {
    dispatch({ type: 'ADD_SERVICE', service, quantity: 1 })
  }

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_SERVICE', serviceId })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', serviceId, quantity })
    }
  }

  const removeFromCart = (serviceId: string) => {
    dispatch({ type: 'REMOVE_SERVICE', serviceId })
  }

  const getServiceQuantity = (serviceId: string) => {
    const item = state.services.find(item => item.service.id === serviceId)
    return item?.quantity || 0
  }

  const servicesByCategory = services.reduce((acc, service) => {
    const categoryName = service.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Seleziona i Servizi
        </h2>
        <p className="text-gray-600">
          Scegli i servizi di cui hai bisogno e indica le quantità
        </p>
      </div>

      {/* Carrello servizi selezionati */}
      {state.services.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🛒 Servizi Selezionati ({state.services.length})
          </h3>
          <div className="space-y-3">
            {state.services.map(item => (
              <div key={item.service.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.service.name}</h4>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.service.basePrice)} per {item.service.unit}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.service.id, parseInt(e.target.value) || 0)}
                      className="w-16 h-8 text-center"
                      min="0"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="font-semibold">{formatPrice(item.totalPrice)}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => removeFromCart(item.service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between items-center font-semibold text-lg">
              <span>Subtotale Servizi:</span>
              <span className="text-blue-600">{formatPrice(state.totals.servicesTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtri categorie */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          Tutti
        </Button>
        {Array.from(new Set(services.map(s => s.category.name))).map(categoryName => (
          <Button
            key={categoryName}
            variant={selectedCategory === categoryName.toLowerCase() ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(categoryName.toLowerCase())}
            size="sm"
          >
            {categoryName === 'Idraulico' && '🔧'} 
            {categoryName === 'Elettricista' && '⚡'} 
            {categoryName === 'Imbiancatura' && '🎨'} 
            {categoryName === 'Piccole Riparazioni' && '🛠️'} 
            {' '}
            {categoryName}
          </Button>
        ))}
      </div>

      {/* Lista servizi */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Caricamento servizi...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(servicesByCategory).map(([categoryName, categoryServices]) => (
            <div key={categoryName}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">
                  {categoryName === 'Idraulico' && '🔧'}
                  {categoryName === 'Elettricista' && '⚡'}
                  {categoryName === 'Imbiancatura' && '🎨'}
                  {categoryName === 'Piccole Riparazioni' && '🛠️'}
                </span>
                {categoryName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryServices.map(service => {
                  const quantity = getServiceQuantity(service.id)
                  return (
                    <div key={service.id} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">{formatPrice(service.basePrice)}</div>
                          <div className="text-sm text-gray-500">per {service.unit}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          🕐 ~{service.estimatedDuration}h
                        </span>
                        {quantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(service.id, quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(service.id, quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => addToCart(service)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Aggiungi
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}