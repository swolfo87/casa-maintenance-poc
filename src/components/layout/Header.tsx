'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { User, LogOut } from 'lucide-react'

export default function Header() {
  const { state: authState, logout } = useAuth()

  // Mostra loading placeholder durante il caricamento
  if (authState.isLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
                🏠 Casa Maintenance
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/servizi" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Servizi
              </Link>
              
              {/* Loading placeholder */}
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </nav>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              🏠 Casa Maintenance
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link href="/servizi" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Servizi
            </Link>
            
            {authState.isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/preventivo">
                  <Button size="sm">
                    Nuovo Preventivo
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l">
                  <div className="flex items-center text-sm text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    <span>{authState.user?.firstName} {authState.user?.lastName}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Accedi
                  </Button>  
                </Link>
                <Link href="/preventivo">
                  <Button size="sm">
                    Richiedi Preventivo
                  </Button>
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link href="/preventivo">
                Preventivo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}