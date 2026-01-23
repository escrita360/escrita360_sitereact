import api from './api.js'

export const plansService = {
  /**
   * Buscar planos disponíveis por audiência
   * @param {string} audience - Tipo de público (estudantes, professores, escolas)
   * @returns {Promise<Object>} - Dados dos planos
   */
  async getPlans(audience = 'estudantes') {
    try {
      console.log('📥 Buscando planos da API para audience:', audience)
      const response = await api.get('/payment/plans', {
        params: { audience }
      })

      console.log('✅ Planos recebidos da API:', response.data.plans?.length || 0)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar planos:', error)

      // Fallback para dados locais em caso de erro da API
      console.log('🔄 Usando dados locais como fallback')
      return this.getLocalPlans(audience)
    }
  },

  /**
   * Fallback: Buscar planos locais (dados hardcoded)
   * @param {string} audience - Tipo de público
   * @returns {Object} - Dados dos planos locais
   */
  getLocalPlans(audience = 'estudantes') {
    console.log('📋 Usando planos locais para audience:', audience)

    // Planos para estudantes
    const studentPlans = [
      {
        id: 'basico_estudante',
        name: 'Plano Básico',
        badge: 'Preço promocional de lançamento',
        monthlyPrice: 49,
        yearlyPrice: 588,
        subDescription: '',
        credits: 10,
        popular: true,
        buttonText: 'Escolher Plano',
        buttonVariant: 'default',
        audience: 'estudantes'
      }
    ]

    // Planos para professores
    const teacherPlans = [
      {
        id: 'professor_solo',
        name: 'Plano Básico',
        badge: 'Preço promocional de lançamento',
        monthlyPrice: 120,
        yearlyPrice: 1440,
        subDescription: '',
        credits: 60,
        popular: true,
        features: [
          { text: '60 correções detalhadas com IA', included: true },
          { text: 'Acesso por 1 mês', included: true }
        ],
        buttonText: 'Escolher Plano',
        buttonVariant: 'default',
        audience: 'professores'
      },
      {
        id: 'progressivo_professor',
        name: 'Plano Progressivo',
        badge: 'Melhor investimento',
        monthlyPrice: 570,
        yearlyPrice: 3420,
        credits: 300,
        popular: true,
        features: [
          { text: 'Criação e gerenciamento de Turmas', included: true },
          { text: 'Banco de rubricas para facilitar a avaliação', included: true },
          { text: 'Correção via foto ou texto direto na plataforma', included: true },
          { text: 'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)', included: true },
          { text: 'Correção com IA (ENEM e texto dissertativo-argumentativo)', included: true, highlighted: true },
          { text: 'Relatórios consolidados (Habilidades BNCC X ENEM)', included: true },
          { text: '300 correções detalhadas com IA', included: true },
          { text: 'Acesso por 6 meses', included: true }
        ],
        buttonText: 'Escolher Plano',
        buttonVariant: 'default',
        audience: 'professores'
      }
    ]

    // Planos para escolas
    const schoolPlans = [
      {
        id: 'semestral_500',
        name: 'Plano Semestral',
        badge: 'Institucional',
        monthlyPrice: 1200,
        description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
        credits: 500,
        planType: 'semestral',
        features: [
          { text: 'Módulo de escrita digital autorregulada', included: true },
          { text: 'Banco de estratégias para escrita', included: true },
          { text: 'Sugestão de temas', included: true },
          { text: 'Recursos de apoio autorregulatório', included: true },
          { text: 'Insights para melhoria da escrita', included: true },
          { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
          { text: 'Rubricas qualitativas para avaliação', included: true },
          { text: 'Correção por foto ou digitada (OCR)', included: true },
          { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
          { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
        ],
        buttonText: 'Escolher Plano',
        buttonVariant: 'default',
        audience: 'escolas'
      },
      {
        id: 'anual_1000',
        name: 'Escola Plano Institucional (Anual)',
        badge: 'Anual Institucional',
        monthlyPrice: 2350,
        description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
        credits: 1000,
        planType: 'anual',
        features: [
          { text: 'Módulo de escrita digital autorregulada', included: true },
          { text: 'Banco de estratégias para escrita', included: true },
          { text: 'Sugestão de temas', included: true },
          { text: 'Recursos de apoio autorregulatório', included: true },
          { text: 'Insights para melhoria da escrita', included: true },
          { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
          { text: 'Rubricas qualitativas para avaliação', included: true },
          { text: 'Correção por foto ou digitada (OCR)', included: true },
          { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
          { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
        ],
        buttonText: 'Escolher Plano',
        buttonVariant: 'default',
        audience: 'escolas'
      }
    ]

    let plans = []

    switch (audience) {
      case 'estudantes':
        plans = studentPlans
        break
      case 'professores':
        plans = teacherPlans
        break
      case 'escolas':
        plans = schoolPlans
        break
      default:
        plans = studentPlans
    }

    return {
      success: true,
      audience,
      plans,
      total: plans.length,
      source: 'local' // Indica que veio dos dados locais
    }
  }
}