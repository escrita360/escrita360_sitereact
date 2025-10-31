import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, List, Laptop, Settings, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    id: 1,
    category: 'plataforma',
    question: 'O que diferencia o Escrita360 das demais plataformas?',
    answer: 'O Escrita360 se apresenta como uma solução inovadora que vai além da correção das redações do ENEM. Funciona como um laboratório digital, com módulo digital imersivo e formativo que permite ao usuário escrever, reescrever, analisar e corrigir seus textos de forma autônoma e reflexiva.\n\nCom recursos integrados de análise e geração de insights, promove o desenvolvimento contínuo das habilidades e aprimora a qualidade da escrita. As correções também podem ser automatizadas com apoio de Inteligência Artificial.'
  },
  {
    id: 2,
    category: 'plataforma',
    question: 'Como Funciona?',
    answer: 'A trajetória de escrita é imersiva e autorregulada, dividida em três fases: **planejamento**, **produção** e **autoavaliação**. A plataforma incentiva o estudante a assumir o controle do processo, oferecendo suporte para um aprendizado progressivo e personalizado.'
  }
];

const categories = [
  { id: 'all', name: 'Todas', icon: List },
  { id: 'plataforma', name: 'Plataforma', icon: Laptop },
  { id: 'implementacao', name: 'Implementação', icon: Settings },
  { id: 'recursos', name: 'Recursos', icon: Wrench }
];

const renderAnswer = (answer) => {
  return answer.split('\n').map((line, index) => {
    if (line.startsWith('#### ')) {
      return <h4 key={index} className='font-semibold text-lg mt-4 mb-2'>{line.replace('#### ', '')}</h4>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className='font-semibold text-xl mt-6 mb-3'>{line.replace('### ', '')}</h3>;
    }
    if (line.startsWith('- ')) {
      return <li key={index} className='ml-4'>{line.replace('- ', '')}</li>;
    }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    return <p key={index} className='mb-2'>{line}</p>;
  });
};

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set());

  const filteredFaqs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = searchTerm === '' ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className='max-w-4xl mx-auto px-4 py-8'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className='text-center mb-12'
        variants={itemVariants}
      >
        <h1 className='text-4xl font-bold text-primary mb-4'>Dúvidas Frequentes</h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Encontre respostas para as principais dúvidas sobre a plataforma Escrita360
        </p>
      </motion.div>

      <motion.div
        className='mb-8'
        variants={itemVariants}
      >
        <div className='relative max-w-md mx-auto'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            type='text'
            placeholder='Pesquise sua dúvida...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
      </motion.div>

      <motion.div
        className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'
        variants={itemVariants}
      >
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeCategory === category.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.id)}
                className='flex flex-col items-center gap-2 h-auto py-4 w-full'
              >
                <Icon className='h-6 w-6' />
                <span className='text-sm'>{category.name}</span>
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className='space-y-4'
        variants={containerVariants}
      >
        {filteredFaqs.length === 0 ? (
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className='text-center py-12'>
                <Search className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>Nenhuma pergunta encontrada</h3>
                <p className='text-muted-foreground'>
                  Tente usar outras palavras-chave ou navegue pelas categorias acima.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              variants={cardVariants}
              layout
            >
              <Card className='overflow-hidden'>
                <CardHeader className='pb-0'>
                  <Button
                    variant='ghost'
                    onClick={() => toggleItem(faq.id)}
                    className='w-full justify-between p-0 h-auto hover:bg-transparent'
                  >
                    <CardTitle className='text-left text-lg font-semibold'>
                      {faq.question}
                    </CardTitle>
                    <motion.div
                      animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className='h-5 w-5 transition-transform' />
                    </motion.div>
                  </Button>
                </CardHeader>
                <AnimatePresence>
                  {openItems.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className='overflow-hidden'
                    >
                      <CardContent className='pt-4'>
                        <div className='prose prose-sm max-w-none text-muted-foreground'>
                          {renderAnswer(faq.answer)}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
