'use client'

import { useQuote } from '@/contexts/QuoteContext'
import { Button } from '@/components/ui/button'
import Step1Services from '@/components/quote/Step1Services'
import Step2Details from '@/components/quote/Step2Details'
import Step3Summary from '@/components/quote/Step3Summary'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PreventivoPage() {
  const { state, dispatch } = useQuote()

  const nextStep = () => {
    if (state.step < 3) {
      dispatch({ type: 'SET_STEP', step: state.step + 1 })
    }
  }

  const prevStep = () => {
    if (state.step > 1) {
      dispatch({ type: 'SET_STEP', step: state.step - 1 })
    }
  }

  const canProceed = () => {
    switch (state.step) {
      case 1:
        return state.services.length > 0
      case 2:
        return state.formData.address.trim().length > 0 && state.formData.workStartDate
      case 3:
        return true
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (state.step) {
      case 1:
        return 'Seleziona i Servizi'
      case 2:
        return 'Dettagli del Lavoro'
      case 3:
        return 'Riepilogo e Conferma'
      default:
        return 'Richiesta Preventivo'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Richiesta Preventivo
            </h1>
            <p className="text-gray-600">
              {getStepTitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === state.step
                    ? 'bg-blue-600 text-white'
                    : step < state.step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < state.step ? '✓' : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < state.step ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4 space-x-8 text-sm">
          <span className={state.step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Servizi
          </span>
          <span className={state.step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Dettagli
          </span>
          <span className={state.step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Riepilogo
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
          {/* Step Content */}
          {state.step === 1 && <Step1Services />}
          {state.step === 2 && <Step2Details />}
          {state.step === 3 && <Step3Summary />}
        </div>
      </div>

      {/* Navigation Bar (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {state.step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Indietro
                </Button>
              )}
            </div>
            
            <div className="text-center">
              {state.services.length > 0 && (
                <div className="text-sm text-gray-600">
                  Totale: <span className="font-semibold text-blue-600 text-lg">
                    €{Number(state.totals.finalTotal).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {state.step < 3 ? (
                <Button 
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="min-w-[120px]"
                >
                  {state.step === 1 && state.services.length === 0 
                    ? 'Seleziona Servizi' 
                    : 'Continua'
                  }
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button className="min-w-[120px]" disabled>
                  Conferma Preventivo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}