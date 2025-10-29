import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx'
import { cn } from '@/lib/utils'
import ChatBot from '@/components/ChatBot.jsx'
import logo from '@/assets/logo2.svg'

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 animate-fade-in-down">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-slate-900 logo-animate">
                    <img src={logo} alt="Logo Escrita360" className="h-16 w-auto transition-transform duration-500 hover:scale-110" />
                  <span className="sr-only">Escrita360</span>
                </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/" ? "border-b-2 border-brand-primary pb-1" : "")}>Home</Link>
            <Link to="/para-quem" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/para-quem" ? "border-b-2 border-brand-primary pb-1" : "")}>Para Quem</Link>
            <Link to="/recursos" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/recursos" ? "border-b-2 border-brand-primary pb-1" : "")}>Recursos</Link>
            <Link to="/precos" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/precos" ? "border-b-2 border-brand-primary pb-1" : "")}>Planos</Link>
            <Link to="/contato" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/contato" ? "border-b-2 border-brand-primary pb-1" : "")}>Contato</Link>
            <Button asChild size="lg" className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-dark)]">
              <Link to="/login">Entrar</Link>
            </Button>
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
                  className={cn("text-lg font-medium text-slate-700 hover:text-brand-primary transition-colors", location.pathname === "/" ? "border-b-2 border-brand-primary pb-1" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/para-quem"
                  className={cn("text-lg font-medium text-slate-700 hover:text-brand-primary transition-colors", location.pathname === "/para-quem" ? "border-b-2 border-brand-primary pb-1" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  Para Quem
                </Link>
                <Link
                  to="/recursos"
                  className={cn("text-lg font-medium text-slate-700 hover:text-brand-primary transition-colors", location.pathname === "/recursos" ? "border-b-2 border-brand-primary pb-1" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  Recursos
                </Link>
                <Link
                  to="/precos"
                  className={cn("text-lg font-medium text-slate-700 hover:text-brand-primary transition-colors", location.pathname === "/precos" ? "border-b-2 border-brand-primary pb-1" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  Planos
                </Link>
                <Link
                  to="/contato"
                  className={cn("text-lg font-medium text-slate-700 hover:text-brand-primary transition-colors", location.pathname === "/contato" ? "border-b-2 border-brand-primary pb-1" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  Contato
                </Link>
                <Button asChild className="mt-4 w-full bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-dark)]">
                  <Link to="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      {/* Main Content */}
      <main className="animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="mb-4 block flex items-center gap-2">
                <img src={logo} alt="Logo Escrita360" className="h-16 w-auto transition-transform duration-500 hover:scale-110" style={{ filter: 'brightness(0) invert(1)' }} />
                  {/* Removido texto 'Escrita' */}
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
            <p>&copy; 2025. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* ChatBot Flutuante */}
      <ChatBot />
    </div>
  )
}

export default Layout