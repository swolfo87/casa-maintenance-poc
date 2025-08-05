import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

// Helper per verificare il token JWT
function verifyToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Token mancante')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
    return decoded.userId
  } catch (error) {
    throw new Error('Token non valido')
  }
}

// GET - Lista preventivi utente
export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)

    const quotes = await prisma.quote.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            service: {
              include: {
                category: true
              }
            }
          }
        },
        addons: {
          include: {
            addon: true
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Errore nel caricamento preventivi:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: error instanceof Error && error.message.includes('Token') ? 401 : 500 }
    )
  }
}

// POST - Crea nuovo preventivo
export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    const { services, addons, formData, totals } = await request.json()

    // Validazione
    if (!services || services.length === 0) {
      return NextResponse.json(
        { error: 'Almeno un servizio è richiesto' },
        { status: 400 }
      )
    }

    if (!formData.address || !formData.workStartDate) {
      return NextResponse.json(
        { error: 'Indirizzo e data inizio sono obbligatori' },
        { status: 400 }
      )
    }

    // Calcola date di fine lavoro
    const startDate = new Date(formData.workStartDate)
    const totalHours = services.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.service.estimatedDuration), 0
    )
    
    const workingHoursPerDay = 8
    const workingDays = Math.ceil(totalHours / workingHoursPerDay)
    
    let endDate = new Date(startDate)
    let daysAdded = 0
    
    while (daysAdded < workingDays) {
      endDate.setDate(endDate.getDate() + 1)
      if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
        daysAdded++
      }
    }

    // Crea il preventivo con transazione
    const quote = await prisma.$transaction(async (tx) => {
      // Crea preventivo
      const newQuote = await tx.quote.create({
        data: {
          userId,
          status: 'PENDING',
          totalAmount: totals.finalTotal,
          workStartDate: startDate,
          estimatedEndDate: endDate,
          address: formData.address,
          description: formData.description || null
        }
      })

      // Crea items servizi
      await tx.quoteItem.createMany({
        data: services.map((item: any) => ({
          quoteId: newQuote.id,
          serviceId: item.service.id,
          quantity: item.quantity,
          unitPrice: Number(item.service.basePrice),
          totalPrice: item.totalPrice
        }))
      })

      // Crea addon se presenti
      if (addons && addons.length > 0) {
        await tx.quoteAddon.createMany({
          data: addons.map((addon: any) => ({
            quoteId: newQuote.id,
            addonId: addon.id,
            price: Number(addon.price)
          }))
        })
      }

      return newQuote
    })

    // Ricarica il preventivo completo
    const fullQuote = await prisma.quote.findUnique({
      where: { id: quote.id },
      include: {
        items: {
          include: {
            service: {
              include: {
                category: true
              }
            }
          }
        },
        addons: {
          include: {
            addon: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Preventivo creato con successo',
      quote: fullQuote
    })

  } catch (error) {
    console.error('Errore nella creazione preventivo:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: error instanceof Error && error.message.includes('Token') ? 401 : 500 }
    )
  }
}