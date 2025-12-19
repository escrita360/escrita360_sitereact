import robo from '@/assets/Logo/robo.svg'

export function PageHero({ title, titleHighlight, subtitle, titleHighlightClass = 'text-brand-primary', highlightFirst = false }) {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Conteúdo do texto */}
          <div className="text-center animate-fade-in-left">
            <h1 className={`font-bold mb-6 ${title.includes('(Programa individual)') ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-3xl md:text-4xl lg:text-5xl'}`}>
              {highlightFirst ? (
                <>
                  {titleHighlight && <span className={titleHighlightClass}>{titleHighlight}</span>}
                  <span className="text-slate-900"> {title}</span>
                </>
              ) : (
                <>
                  <span className="text-slate-900">{title} </span>
                  {titleHighlight && <span className={titleHighlightClass}>{titleHighlight}</span>}
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
              {subtitle}
            </p>
          </div>

          {/* Imagem do robô */}
          <div className="flex justify-center lg:justify-end animate-fade-in-right delay-200">
            <img 
              src={robo} 
              alt="Robô Escrita360" 
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 animate-float hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
