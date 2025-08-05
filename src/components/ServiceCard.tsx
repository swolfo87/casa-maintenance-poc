import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ServiceCardProps {
  id: string
  name: string
  description?: string
  basePrice: number
  unit: string
  estimatedDuration: number
  category: {
    name: string
  }
  onAddToQuote?: (serviceId: string) => void
}

export default function ServiceCard({
  id,
  name,
  description,
  basePrice,
  unit,
  estimatedDuration,
  category,
  onAddToQuote
}: ServiceCardProps) {
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Idraulico': return '🔧'
      case 'Elettricista': return '⚡'
      case 'Imbiancatura': return '🎨'
      case 'Piccole Riparazioni': return '🛠️'
      default: return '🏠'
    }
  }

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case 'Idraulico': return 'bg-blue-100 text-blue-800'
      case 'Elettricista': return 'bg-yellow-100 text-yellow-800'
      case 'Imbiancatura': return 'bg-purple-100 text-purple-800'
      case 'Piccole Riparazioni': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header con categoria */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.name)}`}>
          {getCategoryIcon(category.name)} {category.name}
        </span>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(basePrice)}
          </div>
          <div className="text-sm text-gray-500">
            per {unit}
          </div>
        </div>
      </div>

      {/* Nome e descrizione */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {name}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Info aggiuntive */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <span className="mr-1">🕐</span>
          <span>~{estimatedDuration}h</span>
        </div>
        <div className="text-right">
          <span className="text-gray-400">Tempo stimato</span>
        </div>
      </div>

      {/* Bottone azione */}
      <div className="pt-4 border-t">
        {onAddToQuote ? (
          <Button 
            onClick={() => onAddToQuote(id)}
            className="w-full"
            size="sm"
          >
            Aggiungi al Preventivo
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            size="sm"
            asChild
          >
            <a href="/preventivo">
              Richiedi Preventivo
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}