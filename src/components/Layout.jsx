import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, ChevronDown, GraduationCap, School, UserCheck } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx'
import { cn } from '@/lib/utils'
import ChatBot from '@/components/ChatBot.jsx'
import CookieConsent from '@/components/CookieConsent.jsx'
import logo from '@/assets/logo2.svg'

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlansDropdownOpen, setIsPlansDropdownOpen] = useState(false)
  const plansDropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const plansOptions = [
    { key: 'estudantes', label: 'Estudantes', icon: GraduationCap },
    { key: 'professores', label: 'Professores Independentes', icon: UserCheck },
    { key: 'escolas', label: 'Escolas', icon: School }
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (plansDropdownRef.current && !plansDropdownRef.current.contains(event.target)) {
        setIsPlansDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePlanSelect = (planKey) => {
    setIsPlansDropdownOpen(false)
    navigate(`/precos?audience=${planKey}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 animate-fade-in-down">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-slate-900 logo-animate">
                    <img src={logo} alt="Logo Escrita360" className="h-16 w-auto transition-transform duration-500 hover:scale-110 animate-fade-in" />
                  <span className="sr-only">Escrita360</span>
                </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/" ? "border-b-2 border-brand-primary pb-1" : "")}>Home</Link>
            <Link to="/para-quem" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/para-quem" ? "border-b-2 border-brand-primary pb-1" : "")}>Para Quem</Link>
            <Link to="/recursos" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/recursos" ? "border-b-2 border-brand-primary pb-1" : "")}>Recursos</Link>
            <Link to="/faq" className={cn("text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105", location.pathname === "/faq" ? "border-b-2 border-brand-primary pb-1" : "")}>FAQ</Link>
            
            {/* Planos Dropdown */}
            <div className="relative" ref={plansDropdownRef}>
              <button
                onClick={() => setIsPlansDropdownOpen(!isPlansDropdownOpen)}
                className={cn(
                  "flex items-center gap-1 text-slate-700 hover:text-brand-primary transition-all duration-300 hover:scale-105",
                  location.pathname === "/precos" ? "border-b-2 border-brand-primary pb-1" : ""
                )}
              >
                Planos
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isPlansDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isPlansDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {plansOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.key}
                        onClick={() => handlePlanSelect(option.key)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-l-4 border-transparent hover:border-brand-primary"
                      >
                        <IconComponent className="w-5 h-5 text-brand-primary" />
                        <span className="font-medium text-slate-700">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

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
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
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
                  to="/faq"
                  className={cn("text-lg font-medium text-slate-700 hover:text-brand-primary transition-colors", location.pathname === "/faq" ? "border-b-2 border-brand-primary pb-1" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  FAQ
                </Link>
                
                {/* Planos Section Mobile */}
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs font-semibold text-slate-500 mb-2 px-2">PLANOS</p>
                  {plansOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.key}
                        onClick={() => {
                          handlePlanSelect(option.key)
                          setIsOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-50 rounded-md transition-colors text-left"
                      >
                        <IconComponent className="w-5 h-5 text-brand-primary" />
                        <span className="text-base font-medium text-slate-700">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <Link
                  to="/contato"
                  className={cn("text-lg font-medium text-slate-700 hover:text-brand-primary transition-colors border-t pt-4", location.pathname === "/contato" ? "border-b-2 border-brand-primary pb-1" : "")}
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
          <div className="grid md:grid-cols-5 gap-8 mb-8">
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
              <h3 className="font-bold mb-4">Institucional</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/sobre-nos" className="hover:text-white transition-colors">Sobre Nós</Link></li>
                <li><Link to="/carreiras" className="hover:text-white transition-colors">Carreiras</Link></li>
                <li><Link to="/termos-servico" className="hover:text-white transition-colors">Termos de Serviço</Link></li>
                <li><Link to="/politica-privacidade" className="hover:text-white transition-colors">Políticas de Privacidade</Link></li>
                <li><Link to="/programa-integridade" className="hover:text-white transition-colors">Programa de Integridade</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/contato" className="hover:text-white transition-colors">Suporte</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contato" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contato" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link to="/politica-cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>Copyright © 2025 Escrita360. Todos os direitos reservados</p>
          </div>
        </div>
      </footer>

      {/* ChatBot Flutuante */}
      <ChatBot />

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  )
}

export default Layout