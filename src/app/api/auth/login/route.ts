import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validazione
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatori' },
        { status: 400 }
      )
    }

    // Trova utente
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email o password non corretti' },
        { status: 401 }
      )
    }

    // Verifica password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email o password non corretti' },
        { status: 401 }
      )
    }

    // Genera JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Rimuovi password dalla risposta
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login effettuato con successo',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Errore login:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}