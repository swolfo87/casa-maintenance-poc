import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HomePage() {
  // Carica le categorie per mostrarle in homepage
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { services: true }
      }
    }
  })

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Manutenzione Casa
              <span className="block text-blue-200">Semplice e Veloce</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-blue-100 mb-8">
              Richiedi preventivi automatici per servizi di casa. 
              Idraulico, elettricista, imbiancatura e piccole riparazioni.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/preventivo">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Richiedi Preventivo Gratuito
                </Button>
              </Link>
              <Link href="/servizi">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                  Vedi Listino Servizi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categorie Servizi */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              I Nostri Servizi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scegli tra le nostre categorie di servizi e ricevi un preventivo immediato
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
                <div className="text-center">
                  <div className="text-4xl mb-4">
                    {category.name === 'Idraulico' && '🔧'}
                    {category.name === 'Elettricista' && '⚡'}
                    {category.name === 'Imbiancatura' && '🎨'}
                    {category.name === 'Piccole Riparazioni' && '🛠️'}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <p className="text-sm text-blue-600 mb-4">
                    {category._count.services} servizi disponibili
                  </p>
                  <Link href={`/servizi?categoria=${category.name.toLowerCase()}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Vedi Servizi
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Come Funziona */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Come Funziona
            </h2>
            <p className="text-lg text-gray-600">
              Semplice in 3 passaggi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Scegli i Servizi</h3>
              <p className="text-gray-600">
                Seleziona i servizi di cui hai bisogno dal nostro listino
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ricevi il Preventivo</h3>
              <p className="text-gray-600">
                Calcolo automatico del prezzo e delle tempistiche
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Conferma e Paga</h3>
              <p className="text-gray-600">
                Approva il preventivo e procedi con il pagamento sicuro
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/preventivo">
              <Button size="lg" className="px-8 py-3">
                Inizia Subito
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}