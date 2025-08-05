'use client'

import { useState, useEffect } from 'react'
import ServiceCard from '@/components/ServiceCard'
import { Button } from '@/components/ui/button'

interface Service {
  id: string
  name: string
  description?: string
  basePrice: number
  unit: string
  estimatedDuration: number
  category: {
    name: string
  }
}

interface Category {
  id: string
  name: string
  description?: string
  _count: {
    services: number
  }
}

export default function ServiziPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Carica categorie
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Errore caricamento categorie:', err))
  }, [])

  // Carica servizi
  useEffect(() => {
    setLoading(true)
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
        console.error('Errore caricamento servizi:', err)
        setLoading(false)
      })
  }, [selectedCategory])

  // Raggruppa servizi per categoria per la visualizzazione
  const servicesByCategory = services.reduce((acc, service) => {
    const categoryName = service.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header della pagina */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Listino Servizi
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scegli tra i nostri servizi professionali per la manutenzione della tua casa.
              Prezzi trasparenti e preventivi immediati.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtri categorie */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              Tutti i Servizi ({services.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name.toLowerCase() ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name.toLowerCase())}
                size="sm"
              >
                {category.name === 'Idraulico' && '🔧'} 
                {category.name === 'Elettricista' && '⚡'} 
                {category.name === 'Imbiancatura' && '🎨'} 
                {category.name === 'Piccole Riparazioni' && '🛠️'} 
                {' '}
                {category.name} ({category._count.services})
              </Button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Caricamento servizi...</p>
          </div>
        )}

        {/* Servizi raggruppati per categoria */}
        {!loading && Object.keys(servicesByCategory).length > 0 && (
          <div className="space-y-12">
            {Object.entries(servicesByCategory).map(([categoryName, categoryServices]) => (
              <div key={categoryName}>
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3">
                      {categoryName === 'Idraulico' && '🔧'}
                      {categoryName === 'Elettricista' && '⚡'}
                      {categoryName === 'Imbiancatura' && '🎨'}
                      {categoryName === 'Piccole Riparazioni' && '🛠️'}
                    </span>
                    {categoryName}
                  </h2>
                  <div className="ml-4 text-sm text-gray-500">
                    {categoryServices.length} servizi
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map(service => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      name={service.name}
                      description={service.description}
                      basePrice={service.basePrice}
                      unit={service.unit}
                      estimatedDuration={service.estimatedDuration}
                      category={service.category}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nessun servizio trovato
            </h3>
            <p className="text-gray-600 mb-4">
              Prova a cambiare i filtri o torna alla vista completa
            </p>
            <Button onClick={() => setSelectedCategory('all')}>
              Mostra Tutti i Servizi
            </Button>
          </div>
        )}

        {/* CTA finale */}
        {!loading && services.length > 0 && (
          <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto per iniziare?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Seleziona i servizi di cui hai bisogno e ricevi un preventivo automatico
              con calcolo delle tempistiche di lavoro.
            </p>
            <Button size="lg" asChild>
              <a href="/preventivo">
                Richiedi Preventivo Gratuito
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}