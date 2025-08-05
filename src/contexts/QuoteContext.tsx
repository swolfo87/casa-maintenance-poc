'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Service, AddonService } from '@/types'

interface CartItem {
  service: Service
  quantity: number
  totalPrice: number
}

interface QuoteState {
  step: number
  services: CartItem[]
  addons: AddonService[]
  formData: {
    address: string
    description: string
    workStartDate: Date | null
  }
  totals: {
    servicesTotal: number
    addonsTotal: number
    finalTotal: number
  }
}

type QuoteAction = 
  | { type: 'SET_STEP'; step: number }
  | { type: 'ADD_SERVICE'; service: Service; quantity: number }
  | { type: 'REMOVE_SERVICE'; serviceId: string }
  | { type: 'UPDATE_QUANTITY'; serviceId: string; quantity: number }
  | { type: 'ADD_ADDON'; addon: AddonService }
  | { type: 'REMOVE_ADDON'; addonId: string }
  | { type: 'UPDATE_FORM_DATA'; data: Partial<QuoteState['formData']> }
  | { type: 'CALCULATE_TOTALS' }
  | { type: 'RESET_QUOTE' }

const initialState: QuoteState = {
  step: 1,
  services: [],
  addons: [],
  formData: {
    address: '',
    description: '',
    workStartDate: null
  },
  totals: {
    servicesTotal: 0,
    addonsTotal: 0,
    finalTotal: 0
  }
}

function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step }

    case 'ADD_SERVICE': {
      const existingIndex = state.services.findIndex(
        item => item.service.id === action.service.id
      )
      
      let newServices
      if (existingIndex >= 0) {
        newServices = state.services.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + action.quantity,
                totalPrice: (item.quantity + action.quantity) * Number(action.service.basePrice)
              }
            : item
        )
      } else {
        newServices = [
          ...state.services,
          {
            service: action.service,
            quantity: action.quantity,
            totalPrice: action.quantity * Number(action.service.basePrice)
          }
        ]
      }
      
      const newState = { ...state, services: newServices }
      return calculateTotals(newState)
    }

    case 'REMOVE_SERVICE': {
      const newServices = state.services.filter(
        item => item.service.id !== action.serviceId
      )
      const newState = { ...state, services: newServices }
      return calculateTotals(newState)
    }

    case 'UPDATE_QUANTITY': {
      const newServices = state.services.map(item =>
        item.service.id === action.serviceId
          ? {
              ...item,
              quantity: action.quantity,
              totalPrice: action.quantity * Number(item.service.basePrice)
            }
          : item
      )
      const newState = { ...state, services: newServices }
      return calculateTotals(newState)
    }

    case 'ADD_ADDON': {
      const addonExists = state.addons.some(addon => addon.id === action.addon.id)
      if (addonExists) return state
      
      const newAddons = [...state.addons, action.addon]
      const newState = { ...state, addons: newAddons }
      return calculateTotals(newState)
    }

    case 'REMOVE_ADDON': {
      const newAddons = state.addons.filter(addon => addon.id !== action.addonId)
      const newState = { ...state, addons: newAddons }
      return calculateTotals(newState)
    }

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.data }
      }

    case 'CALCULATE_TOTALS':
      return calculateTotals(state)

    case 'RESET_QUOTE':
      return initialState

    default:
      return state
  }
}

function calculateTotals(state: QuoteState): QuoteState {
  const servicesTotal = state.services.reduce((sum, item) => sum + item.totalPrice, 0)
  const addonsTotal = state.addons.reduce((sum, addon) => sum + Number(addon.price), 0)
  const finalTotal = servicesTotal + addonsTotal

  return {
    ...state,
    totals: {
      servicesTotal,
      addonsTotal,
      finalTotal
    }
  }
}

// Calcolo date di lavoro
export function calculateWorkDates(services: CartItem[], startDate: Date) {
  const totalHours = services.reduce(
    (sum, item) => sum + (item.quantity * item.service.estimatedDuration), 0
  )
  
  const workingHoursPerDay = 8
  const workingDays = Math.ceil(totalHours / workingHoursPerDay)
  
  // Escludi weekend
  let endDate = new Date(startDate)
  let daysAdded = 0
  
  while (daysAdded < workingDays) {
    endDate.setDate(endDate.getDate() + 1)
    // Lunedì = 1, Domenica = 0, Sabato = 6
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
      daysAdded++
    }
  }
  
  return {
    startDate,
    endDate,
    totalHours,
    workingDays
  }
}

const QuoteContext = createContext<{
  state: QuoteState
  dispatch: React.Dispatch<QuoteAction>
} | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quoteReducer, initialState)

  return (
    <QuoteContext.Provider value={{ state, dispatch }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote deve essere usato dentro QuoteProvider')
  }
  return context
}