export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  createdAt: Date
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  _count?: {
    services: number
  }
}

export interface Service {
  id: string
  categoryId: string
  name: string
  description?: string
  basePrice: number
  unit: string
  estimatedDuration: number
  isActive: boolean
  createdAt: Date
  category: ServiceCategory
}

export interface Quote {
  id: string
  userId: string
  status: QuoteStatus
  totalAmount: number
  workStartDate?: Date
  estimatedEndDate?: Date
  actualEndDate?: Date
  address: string
  description?: string
  createdAt: Date
  updatedAt: Date
  user: User
  items: QuoteItem[]
  addons: QuoteAddon[]
  payments: Payment[]
}

export interface QuoteItem {
  id: string
  quoteId: string
  serviceId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  service: Service
}

export interface AddonService {
  id: string
  name: string
  price: number
  applicableToCategoryIds: string[]
  isActive: boolean
}

export interface QuoteAddon {
  id: string
  quoteId: string
  addonId: string
  price: number
  addon: AddonService
}

export interface Payment {
  id: string
  quoteId: string
  stripePaymentIntentId?: string
  amount: number
  status: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// Tipi per form e UI
export interface QuoteFormData {
  services: Array<{
    serviceId: string
    quantity: number
  }>
  addons: string[]
  address: string
  description?: string
  workStartDate: Date
}

export interface CartItem {
  service: Service
  quantity: number
  totalPrice: number
}