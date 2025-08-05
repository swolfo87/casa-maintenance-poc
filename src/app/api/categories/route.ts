import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { services: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Errore nel caricamento categorie:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento categorie' },
      { status: 500 }
    )
  }
}