import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import img1 from '../assets/Portfolio/1.svg';
import img3 from '../assets/Portfolio/3.svg';
import img4 from '../assets/Portfolio/4.svg';
import img5 from '../assets/Portfolio/5.svg';
import img6 from '../assets/Portfolio/6.svg';
import img7 from '../assets/Portfolio/7.svg';
import img8 from '../assets/Portfolio/8.svg';
import img9 from '../assets/Portfolio/9.svg';
import img10 from '../assets/Portfolio/10.svg';
import img11 from '../assets/Portfolio/11.svg';
import img12 from '../assets/Portfolio/12.svg';
import img13 from '../assets/Portfolio/13.svg';
import img14 from '../assets/Portfolio/14.svg';
import img15 from '../assets/Portfolio/15.svg';
import img16 from '../assets/Portfolio/16.svg';
import img17 from '../assets/Portfolio/17.svg';
import img18 from '../assets/Portfolio/18.svg';
import img19 from '../assets/Portfolio/19.svg';
import img20 from '../assets/Portfolio/20.svg';
import img21 from '../assets/Portfolio/21.svg';
import img22 from '../assets/Portfolio/22.svg';
import img23 from '../assets/Portfolio/23.svg';

export default function SobreNos() {
  const images = [img1, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22, img23];
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-brand-dark mb-6">Sobre a Escrita 360</h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed text-center">
            Transformamos o ensino da escrita através de tecnologia inovadora e metodologia autorregulada, 
            oferecendo uma plataforma completa para estudantes, professores e instituições educacionais.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-brand-primary text-white rounded-xl p-12 text-center max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-semibold mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Excelência Educacional</h3>
              <p className="text-brand-lighter leading-relaxed">
                Comprometimento com a qualidade pedagógica e tecnológica em cada funcionalidade da plataforma.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Inovação Pedagógica</h3>
              <p className="text-brand-lighter leading-relaxed">
                Desenvolvimento contínuo de soluções tecnológicas que revolucionam o ensino da escrita.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.997 2.997 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.97L12 11l-1.99-3.03A2.502 2.502 0 0 0 8 7H6.94c-1.24 0-2.31.81-2.9 1.97L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l1.5-2.5L15 16h2.5v6h2.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Colaboração Educativa</h3>
              <p className="text-brand-lighter leading-relaxed">
                Parceria estratégica com educadores e instituições para transformar o ensino da escrita.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-center text-brand-dark mb-12">Nossa Tecnologia em Ação</h2>
          <p className="text-lg text-slate-600 text-center mb-8 max-w-3xl mx-auto">
            Conheça as funcionalidades e recursos que fazem do Escrita 360 a plataforma mais completa 
            para o desenvolvimento da escrita autorregulada e análise inteligente.
          </p>
          
          <div className="relative max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="relative h-[500px] flex items-center justify-center bg-slate-100">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`Portfolio ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-brand-dark bg-opacity-80 hover:bg-brand-primary text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Imagem anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={next}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-brand-dark bg-opacity-80 hover:bg-brand-primary text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Próxima imagem"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center py-6 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-brand-primary scale-125' 
                      : 'bg-gray-300 hover:bg-brand-accent'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
