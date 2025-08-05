import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QuoteProvider } from '@/contexts/QuoteContext'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Casa Maintenance - Servizi per la casa',
  description: 'Piattaforma per preventivi e servizi di manutenzione casa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <AuthProvider>
          <QuoteProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              
              <main className="flex-1">
                {children}
              </main>
              
              <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                    <p>&copy; 2024 Casa Maintenance POC. Tutti i diritti riservati.</p>
																  
										 
                  </div>
                </div>
              </footer>
																										  
						
					  
																												 
						   
					  
																																												  
									   
					  
					  
					
            </div>
          </QuoteProvider>
        </AuthProvider>
								   
					  
				 
		  
																
																	
										   
																				   
					
				  
				   
			  
						
      </body>
    </html>
  )
}