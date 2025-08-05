import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryIds = searchParams.get('categoryIds')?.split(',') || []

    // Se ci sono categorie specifiche, filtra gli addon applicabili
    const whereClause = categoryIds.length > 0 
      ? {
          isActive: true,
          applicableToCategoryIds: {
            hasSome: categoryIds
          }
        }
      : { isActive: true }

    const addons = await prisma.addonService.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(addons)
  } catch (error) {
    console.error('Errore nel caricamento addon:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento addon' },
      { status: 500 }
    )
  }
}