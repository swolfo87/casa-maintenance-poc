import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniziando popolamento database...')

  // Cancella dati esistenti (per evitare duplicati)
  await prisma.quoteItem.deleteMany()
  await prisma.quoteAddon.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.service.deleteMany()
  await prisma.addonService.deleteMany()
  await prisma.serviceCategory.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Dati esistenti cancellati')

  // Crea categorie servizi
  const idraulico = await prisma.serviceCategory.create({
    data: {
      name: 'Idraulico',
      description: 'Servizi di idraulica e riparazione impianti'
    }
  })

  const elettricista = await prisma.serviceCategory.create({
    data: {
      name: 'Elettricista',
      description: 'Servizi elettrici e impianti'
    }
  })

  const imbiancatura = await prisma.serviceCategory.create({
    data: {
      name: 'Imbiancatura',
      description: 'Tinteggiatura e decorazioni'
    }
  })

  const riparazioni = await prisma.serviceCategory.create({
    data: {
      name: 'Piccole Riparazioni',
      description: 'Riparazioni varie e manutenzione'
    }
  })

  console.log('📂 Categorie create:', { idraulico: idraulico.name, elettricista: elettricista.name, imbiancatura: imbiancatura.name, riparazioni: riparazioni.name })

  // Servizi Idraulico
  await prisma.service.createMany({
    data: [
      {
        categoryId: idraulico.id,
        name: 'Riparazione perdite',
        description: 'Riparazione perdite rubinetti e tubature',
        basePrice: 45.00,
        unit: 'ore',
        estimatedDuration: 2
      },
      {
        categoryId: idraulico.id,
        name: 'Sostituzione rubinetto',
        description: 'Sostituzione completa rubinetto bagno/cucina',
        basePrice: 80.00,
        unit: 'unità',
        estimatedDuration: 1
      },
      {
        categoryId: idraulico.id,
        name: 'Spurgo scarichi',
        description: 'Pulizia e spurgo tubature intasate',
        basePrice: 60.00,
        unit: 'unità',
        estimatedDuration: 1
      },
      {
        categoryId: idraulico.id,
        name: 'Installazione sanitari',
        description: 'Installazione WC, bidet, lavandino',
        basePrice: 120.00,
        unit: 'unità',
        estimatedDuration: 3
      }
    ]
  })

  // Servizi Elettricista
  await prisma.service.createMany({
    data: [
      {
        categoryId: elettricista.id,
        name: 'Installazione punti luce',
        description: 'Nuovi punti luce e interruttori',
        basePrice: 35.00,
        unit: 'unità',
        estimatedDuration: 1
      },
      {
        categoryId: elettricista.id,
        name: 'Riparazione impianto',
        description: 'Diagnosi e riparazione guasti elettrici',
        basePrice: 50.00,
        unit: 'ore',
        estimatedDuration: 2
      },
      {
        categoryId: elettricista.id,
        name: 'Installazione lampadari',
        description: 'Montaggio e collegamento lampadari',
        basePrice: 40.00,
        unit: 'unità',
        estimatedDuration: 1
      },
      {
        categoryId: elettricista.id,
        name: 'Quadro elettrico',
        description: 'Controllo e manutenzione quadro elettrico',
        basePrice: 80.00,
        unit: 'unità',
        estimatedDuration: 2
      }
    ]
  })

  // Servizi Imbiancatura
  await prisma.service.createMany({
    data: [
      {
        categoryId: imbiancatura.id,
        name: 'Tinteggiatura pareti',
        description: 'Pittura pareti interne con idropittura',
        basePrice: 12.00,
        unit: 'mq',
        estimatedDuration: 1
      },
      {
        categoryId: imbiancatura.id,
        name: 'Tinteggiatura soffitti',
        description: 'Pittura soffitti con vernice specifica',
        basePrice: 15.00,
        unit: 'mq',
        estimatedDuration: 1
      },
      {
        categoryId: imbiancatura.id,
        name: 'Preparazione superfici',
        description: 'Carteggiatura e preparazione pareti',
        basePrice: 8.00,
        unit: 'mq',
        estimatedDuration: 1
      },
      {
        categoryId: imbiancatura.id,
        name: 'Decorazioni speciali',
        description: 'Spugnature, stencil, effetti decorativi',
        basePrice: 25.00,
        unit: 'mq',
        estimatedDuration: 2
      }
    ]
  })

  // Servizi Piccole Riparazioni
  await prisma.service.createMany({
    data: [
      {
        categoryId: riparazioni.id,
        name: 'Montaggio mobili',
        description: 'Assemblaggio mobili IKEA e similari',
        basePrice: 30.00,
        unit: 'ore',
        estimatedDuration: 2
      },
      {
        categoryId: riparazioni.id,
        name: 'Riparazione porte',
        description: 'Aggiustamento porte, serrature, cerniere',
        basePrice: 40.00,
        unit: 'unità',
        estimatedDuration: 1
      },
      {
        categoryId: riparazioni.id,
        name: 'Montaggio mensole',
        description: 'Installazione mensole e supporti a parete',
        basePrice: 25.00,
        unit: 'unità',
        estimatedDuration: 1
      },
      {
        categoryId: riparazioni.id,
        name: 'Silicone e sigillature',
        description: 'Rifacimento silicone bagno, cucina, finestre',
        basePrice: 20.00,
        unit: 'metri',
        estimatedDuration: 1
      }
    ]
  })

  console.log('🔧 Servizi creati per tutte le categorie')

  // Servizi Addon
  await prisma.addonService.createMany({
    data: [
      {
        name: 'Servizio Urgente (24h)',
        price: 30.00,
        applicableToCategoryIds: [idraulico.id, elettricista.id]
      },
      {
        name: 'Pulizia post-lavoro',
        price: 25.00,
        applicableToCategoryIds: [idraulico.id, elettricista.id, imbiancatura.id, riparazioni.id]
      },
      {
        name: 'Materiali Premium',
        price: 50.00,
        applicableToCategoryIds: [imbiancatura.id, riparazioni.id]
      },
      {
        name: 'Sopralluogo preventivo',
        price: 15.00,
        applicableToCategoryIds: [idraulico.id, elettricista.id, imbiancatura.id, riparazioni.id]
      },
      {
        name: 'Garanzia estesa (2 anni)',
        price: 40.00,
        applicableToCategoryIds: [idraulico.id, elettricista.id]
      }
    ]
  })

  console.log('⭐ Servizi addon creati')

  // Crea un utente di test
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Mario',
      lastName: 'Rossi',
      phone: '+39 333 123 4567',
      address: 'Via Roma 123, Milano'
    }
  })

  console.log('👤 Utente di test creato:', testUser.email)

  // Crea un preventivo di esempio
  const sampleQuote = await prisma.quote.create({
    data: {
      userId: testUser.id,
      status: 'PENDING',
      totalAmount: 180.00,
      workStartDate: new Date('2024-02-15'),
      estimatedEndDate: new Date('2024-02-16'),
      address: 'Via Milano 456, Roma',
      description: 'Riparazione perdita rubinetto cucina + installazione punto luce',
      items: {
        create: [
          {
            serviceId: (await prisma.service.findFirst({ where: { name: 'Riparazione perdite' } }))!.id,
            quantity: 1,
            unitPrice: 45.00,
            totalPrice: 45.00
          },
          {
            serviceId: (await prisma.service.findFirst({ where: { name: 'Installazione punti luce' } }))!.id,
            quantity: 2,
            unitPrice: 35.00,
            totalPrice: 70.00
          }
        ]
      },
      addons: {
        create: [
          {
            addonId: (await prisma.addonService.findFirst({ where: { name: 'Pulizia post-lavoro' } }))!.id,
            price: 25.00
          }
        ]
      }
    }
  })

  console.log('📋 Preventivo di esempio creato')

  console.log('✅ Database popolato con successo!')
  console.log('\n📊 Riepilogo dati creati:')
  console.log(`- ${await prisma.serviceCategory.count()} categorie servizi`)
  console.log(`- ${await prisma.service.count()} servizi`)
  console.log(`- ${await prisma.addonService.count()} servizi addon`)
  console.log(`- ${await prisma.user.count()} utenti`)
  console.log(`- ${await prisma.quote.count()} preventivi`)
  
  console.log('\n🔑 Credenziali utente test:')
  console.log('Email: test@example.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Errore durante il seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })