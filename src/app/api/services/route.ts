import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    // Se c'è un filtro per categoria
    const whereClause = categoria 
      ? {
          isActive: true,
          category: {
            name: {
              contains: categoria,
              mode: 'insensitive' as const
            }
          }
        }
      : { isActive: true }

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: [
        { category: { name: 'asc' } },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Errore nel caricamento servizi:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento servizi' },
      { status: 500 }
    )
  }
}