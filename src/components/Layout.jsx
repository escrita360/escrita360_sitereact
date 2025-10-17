import { Link } from 'react-router-dom'
import { PenTool, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx'

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Escrita360</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-700 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/para-quem" className="text-slate-700 hover:text-blue-600 transition-colors">Para Quem</Link>
            <Link to="/recursos" className="text-slate-700 hover:text-blue-600 transition-colors">Recursos</Link>
            <Link to="/precos" className="text-slate-700 hover:text-blue-600 transition-colors">Preços</Link>
            <Link to="/contato" className="text-slate-700 hover:text-blue-600 transition-colors">Contato</Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/para-quem"
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Para Quem
                </Link>
                <Link
                  to="/recursos"
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Recursos
                </Link>
                <Link
                  to="/precos"
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Preços
                </Link>
                <Link
                  to="/contato"
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contato
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Escrita360</span>
              </Link>
              <p className="text-slate-400">
                A plataforma mais completa para o desenvolvimento da escrita
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Plataformas</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/para-quem" className="hover:text-white transition-colors">Estudantes</Link></li>
                <li><Link to="/para-quem" className="hover:text-white transition-colors">Professores</Link></li>
                <li><Link to="/para-quem" className="hover:text-white transition-colors">Famílias</Link></li>
                <li><Link to="/para-quem" className="hover:text-white transition-colors">Escolas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Recursos</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/recursos" className="hover:text-white transition-colors">Editor Inteligente</Link></li>
                <li><Link to="/recursos" className="hover:text-white transition-colors">Rubricas</Link></li>
                <li><Link to="/recursos" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/recursos" className="hover:text-white transition-colors">Gestão Escolar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/contato" className="hover:text-white transition-colors">Suporte</Link></li>
                <li><Link to="/contato" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contato" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contato" className="hover:text-white transition-colors">Sobre</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Escrita360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout