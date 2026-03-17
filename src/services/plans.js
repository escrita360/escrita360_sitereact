import api from './api.js'

const FALLBACK_PLANS_BY_AUDIENCE = {
  estudantes: [
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
      audience: 'estudantes',
    },
  ],
  professores: [
    {
      id: 'professor_solo',
      name: 'Plano Básico',
      badge: 'Preço promocional de lançamento',
      monthlyPrice: 120,
      yearlyPrice: 1440,
      subDescription: '',
      credits: 60,
      popular: true,
      buttonText: 'Escolher Plano',
      buttonVariant: 'default',
      audience: 'professores',
    },
    {
      id: 'progressivo_professor',
      name: 'Plano Progressivo',
      badge: 'Melhor investimento',
      monthlyPrice: 570,
      yearlyPrice: 3420,
      description: 'Professores (Individual)',
      subDescription: 'Plano com maior quantidade de correções e acesso estendido',
      credits: 300,
      popular: true,
      features: [
        { text: 'Criação e gerenciamento de Turmas', included: true },
        { text: 'Banco de rubricas para facilitar a avaliação', included: true },
        { text: 'Correção via foto ou texto direto na plataforma', included: true },
        { text: 'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)', included: true },
        { text: 'Correção com IA (ENEM e texto dissertativo-argumentativo)', included: true, highlighted: true },
        { text: 'Relatórios consolidados (Habilidades BNCC X ENEM)', included: true },
        { text: 'Acesso por 6 meses', included: true },
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default',
      audience: 'professores',
    },
  ],
  escolas: [],
}

export const plansService = {
  async getPlans(audience = 'estudantes') {
    try {
      const response = await api.get('/payment/plans', {
        params: { audience },
      })
      return response.data
    } catch (error) {
      const fallbackPlans = FALLBACK_PLANS_BY_AUDIENCE[audience] || FALLBACK_PLANS_BY_AUDIENCE.estudantes
      console.warn('⚠️ Falha ao carregar planos do backend. Usando fallback local.', {
        audience,
        error: error?.message,
      })

      return {
        success: false,
        audience,
        plans: fallbackPlans,
        total: fallbackPlans.length,
        error: error?.message || 'Falha ao carregar planos',
      }
    }
  },
}
