import React, { useState, useMemo, useEffect } from 'react';
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
    answer: 'A trajetória de escrita é imersiva e autorregulada, dividida em três fases: **planejamento**, **produção** e **autoavaliação**. A plataforma incentiva o estudante a assumir o controle do processo, oferecendo suporte para um aprendizado progressivo e personalizado.\n\nO módulo de escrita imersivo utiliza o parágrafo-padrão como ponto de partida para estruturar ideias e argumentos com clareza e segurança. Durante o processo, o estudante acompanha sua evolução com rubricas e listas de verificação, aplicando critérios padronizados de avaliação que permitem identificar dificuldades, monitorar o progresso e desenvolver a autorregulação da escrita.\n\nA plataforma gera relatórios automáticos com percentuais por critério, gráficos de desempenho e notas de 0 a 10, transformando dados qualitativos em quantitativos. Além da autoavaliação, o usuário recebe feedback instantâneo via IA após a submissão do texto. Os planos incluem créditos para análises detalhadas e correção automatizada por Inteligência Artificial.'
  },
  {
    id: 3,
    category: 'plataforma',
    question: 'Qual a diferença entre uma correção do Texto dissertativo-argumentativo e Texto dissertativo-argumentativo (Redação ENEM)?',
    answer: '#### Texto dissertativo-argumentativo:\n\nA plataforma disponibiliza um conjunto de listas de verificação e de rubricas com critérios e níveis de desempenho para estimular e desenvolver a autonomia e o protagonismo do aluno no processo de autoavaliação de seus textos.\n\nBusca-se como resultado de aprendizagem que o estudante demonstre domínio das habilidades textuais ao produzir um texto dissertativo-argumentativo com:\n\n- Estrutura adequada ao gênero (introdução, desenvolvimento e conclusão)\n- Aderência ao tema (clareza, pertinência e delimitação)\n- Uso correto da norma culta (vocabulário, ortografia, concordância, pontuação e adequação ao registro formal)\n- Coesão e coerência textual\n- Organização argumentativa clara (relevância, consistência e progressão das ideias)\n- Integração de repertório sociocultural relevante\n- Indícios evidentes de autoria\n\n#### Redação ENEM:\n\nNa Redação ENEM, avalia-se a produção de um texto dissertativo-argumentativo que atenda aos seguintes critérios de excelência, demonstrando domínio das competências textuais e autorais:\n\n- **Competência 1:** Escrita formal\n- **Competência 2:** Desenvolvimento do tema com estrutura dissertativa-argumentativa\n- **Competência 3:** Organização Argumentativa\n- **Competência 4:** Mecanismos Linguísticos\n- **Competência 5:** Proposta de Intervenção\n\nConforme as cinco competências da Matriz de Referência do exame.'
  },
  {
    id: 4,
    category: 'implementacao',
    question: 'A quais segmentos escolares a plataforma atende?',
    answer: 'É uma plataforma pensada para atender a **Educação Básica**, especialmente, o **Ensino Fundamental Anos Finais** e o **Ensino Médio**, etapas em que o texto dissertativo-argumentativo é trabalhado com mais frequência.\n\nPode ser usada também por **estudantes independentes** que estão se preparando para o ENEM e **Cursinhos Preparatórios**.'
  },
  {
    id: 5,
    category: 'implementacao',
    question: 'Como é feita a implementação da plataforma nas escolas?',
    answer: 'O processo é realizado pela **equipe de suporte do Escrita360**, responsável por criar logins, ativar acessos e organizar as formações iniciais com os educadores.\n\nApós a ativação, a escola ou rede conta com **acompanhamento contínuo** para suporte e formações complementares sempre que necessário.'
  },
  {
    id: 6,
    category: 'recursos',
    question: 'Como o desempenho dos alunos nas habilidades escritas pode ser acompanhado?',
    answer: '#### Para o Estudante:\n\nO estudante pode autoavaliar suas produções escritas com o apoio de rubricas e listas de verificação, acompanhando sua evolução por meio de gráficos e níveis de desempenho. Também tem acesso a recursos de análise textual automatizada, que indicam pontos de melhoria e padrões de escrita.\n\n#### Para o Professor:\n\nO professor conta com três tipos de relatórios:\n\n- **Autoavaliações dos alunos**, com notas e gráficos individuais\n- **Análises automatizadas por IA**\n- **Relatórios comparativos**, que mostram os índices de concordância e divergência entre as avaliações de alunos e professores\n\n#### Para a Escola:\n\nA escola dispõe de um dashboard completo, com mapeamento das habilidades por turma, médias de desempenho, comparativos entre autoavaliações e avaliações docentes e relatórios alinhados à BNCC (MEC) e às competências do ENEM (INEP).'
  },
  {
    id: 7,
    category: 'recursos',
    question: 'Como são utilizados os créditos nas correções com IA?',
    answer: 'Quando o usuário solicita a correção, o sistema consome créditos de uso, equivalentes a chamadas à IA. **Cada redação corrigida consome um crédito** (uma unidade de consumo).\n\nEnquanto a assinatura estiver ativa, o usuário poderá utilizar os créditos de IA para correções e análises de textos, conforme o limite do plano contratado.\n\n**Os créditos não utilizados serão acumulados para os meses seguintes**, desde que a assinatura permaneça vigente.'
  },
  {
    id: 8,
    category: 'recursos',
    question: 'Que tipos de recursos de análise estão integrados à plataforma?',
    answer: 'A plataforma possibilita um conjunto de **análises ilimitadas** que incluem:\n\n- **Verificação da estrutura e fluidez do parágrafo**, com a simulação do número de palavras por linha para a redação ENEM\n- **Composição e comprimento das frases**\n- **Frequência de palavras**\n- **Identificação de elementos coesivos** (coesão sequencial e referencial)\n\nIsso permite ajustes em tempo real, para a melhoria contínua da escrita e acompanhamento detalhado das principais dificuldades.'
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
      return <h4 key={index} className='font-semibold text-lg mt-4 mb-2' style={{ color: '#39a1db' }}>{line.replace('#### ', '')}</h4>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className='font-semibold text-xl mt-6 mb-3' style={{ color: '#39a1db' }}>{line.replace('### ', '')}</h3>;
    }
    if (line.startsWith('- ')) {
      const text = line.replace('- ', '');
      const isBold = text.includes('**');
      return <li key={index} className='ml-4 mb-1'>{renderBoldText(text)}</li>;
    }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    return <p key={index} className='mb-2 leading-relaxed'>{renderBoldText(line)}</p>;
  });
};

const renderBoldText = (text) => {
  const parts = text.split(/\*\*(.*?)\*\*/);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className='font-semibold' style={{ color: '#39a1db' }}>{part}</strong>;
    }
    return part;
  });
};

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <h1 className='text-4xl font-bold mb-4' style={{ color: '#39a1db' }}>Dúvidas Frequentes</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Encontre respostas para as principais dúvidas sobre a plataforma Escrita360
        </p>
      </motion.div>

      <motion.div
        className='mb-8'
        variants={itemVariants}
      >
        <div className='relative max-w-md mx-auto'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4' style={{ color: '#39a1db' }} />
          <Input
            type='text'
            placeholder='Pesquise sua dúvida...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
            style={{
              borderColor: '#39a1db',
              '--tw-ring-color': '#39a1db'
            }}
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
                className='flex flex-col items-center gap-2 h-auto py-4 w-full transition-all'
                style={activeCategory === category.id ? {
                  backgroundColor: '#39a1db',
                  color: 'white',
                  borderColor: '#39a1db'
                } : {
                  borderColor: '#39a1db',
                  color: '#39a1db',
                  backgroundColor: 'transparent'
                }}
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
                <Search className='h-12 w-12 mx-auto mb-4' style={{ color: '#39a1db' }} />
                <h3 className='text-lg font-semibold mb-2' style={{ color: '#39a1db' }}>Nenhuma pergunta encontrada</h3>
                <p className='text-gray-600'>
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
              <Card className='overflow-hidden transition-all shadow-sm hover:shadow-md' style={{
                borderColor: '#e0f2ff',
              }}>
                <CardHeader className='pb-0' style={{
                  background: 'linear-gradient(to right, rgba(57, 161, 219, 0.05), rgba(57, 161, 219, 0.02))'
                }}>
                  <Button
                    variant='ghost'
                    onClick={() => toggleItem(faq.id)}
                    className='w-full justify-between p-0 h-auto hover:bg-transparent text-left'
                  >
                    <CardTitle className='text-left text-lg font-semibold transition-colors' style={{
                      color: '#1a1a1a'
                    }} onMouseEnter={(e) => e.currentTarget.style.color = '#39a1db'} onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}>
                      {faq.question}
                    </CardTitle>
                    <motion.div
                      animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className='h-5 w-5 transition-transform' style={{ color: '#39a1db' }} />
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
                      <CardContent className='pt-4' style={{ borderTop: '1px solid #e0f2ff' }}>
                        <div className='prose prose-sm max-w-none text-gray-700'>
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
