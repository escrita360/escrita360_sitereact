// Firebase Configuration and Services
// Integração com o mesmo Firebase usado no app Flutter (escrita360aluno)

import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail 
} from 'firebase/auth'
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'

// Configuração do Firebase - MESMO projeto do app Flutter
const firebaseConfig = {
  apiKey: 'AIzaSyBvRxURO1FNwb1ItnlwSwaPKLtlS5sLVjM',
  authDomain: 'escrita360aluno.firebaseapp.com',
  projectId: 'escrita360aluno',
  storageBucket: 'escrita360aluno.firebasestorage.app',
  messagingSenderId: '167249838189',
  appId: '1:167249838189:web:0ca9443af25880fd007f64',
  measurementId: 'G-KG006BD62G'
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

console.log('✅ Firebase inicializado - projeto:', firebaseConfig.projectId)

/**
 * Helper: Remove campos undefined de um objeto (deep cleaning)
 * Firestore não aceita valores undefined
 */
const removeUndefinedFields = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields).filter(item => item !== undefined)
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        typeof value === 'object' ? removeUndefinedFields(value) : value
      ])
  )
}

/**
 * Serviço de Autenticação Firebase
 */
export const firebaseAuthService = {
  /**
   * Registrar novo usuário
   */
  async register(email, password, userData = {}) {
    try {
      console.log('🔐 Criando conta Firebase para:', email)
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      console.log('✅ Conta Firebase criada - UID:', user.uid)
      
      // Salvar dados do usuário no Firestore
      const userDocData = removeUndefinedFields({
        uid: user.uid,
        email: user.email,
        nome: userData.name || email.split('@')[0],
        cpf: userData.cpf || '',
        telefone: userData.phone || '',
        origem: 'site', // Identifica que veio do site
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        emailVerificado: user.emailVerified,
        ...userData
      })
      
      await setDoc(doc(db, 'usuarios', user.uid), userDocData)
      console.log('✅ Dados do usuário salvos no Firestore')
      
      return {
        success: true,
        uid: user.uid,
        email: user.email,
        user: userDocData
      }
    } catch (error) {
      console.error('❌ Erro ao criar conta:', error)
      
      // Traduzir erros do Firebase
      let errorMessage = 'Erro ao criar conta'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use no mínimo 6 caracteres'
      }
      
      throw new Error(errorMessage)
    }
  },

  /**
   * Login de usuário
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Buscar dados completos do usuário
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid))
      const userData = userDoc.exists() ? userDoc.data() : {}
      
      return {
        success: true,
        uid: user.uid,
        email: user.email,
        user: userData
      }
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error)
      
      let errorMessage = 'Erro ao fazer login'
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email ou senha incorretos'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde'
      }
      
      throw new Error(errorMessage)
    }
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
      throw error
    }
  },

  /**
   * Recuperar senha
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      console.error('❌ Erro ao enviar email de recuperação:', error)
      throw error
    }
  },

  /**
   * Observar mudanças de autenticação
   */
  onAuthChange(callback) {
    return onAuthStateChanged(auth, callback)
  },

  /**
   * Obter usuário atual
   */
  getCurrentUser() {
    return auth.currentUser
  }
}

/**
 * Serviço de Assinaturas no Firestore
 */
export const firebaseSubscriptionService = {
  /**
   * Criar assinatura após pagamento
   */
  async createSubscription(userId, subscriptionData) {
    try {
      console.log('📝 Criando assinatura no Firestore para:', userId)
      
      const { plan, isYearly, paymentData } = subscriptionData
      
      // Calcular datas
      const dataInicio = new Date()
      const dataExpiracao = new Date()
      dataExpiracao.setDate(dataExpiracao.getDate() + (isYearly ? 365 : 30))
      
      // Mapear tipo de assinatura para o formato do app Flutter
      const tipoAssinatura = {
        'Básico': 0,
        'Intermediário': 1,
        'Avançado': 2
      }[plan.name] || 0
      
      // Criar documento de assinatura (compatível com AssinaturaModel do Flutter)
      const assinaturaData = removeUndefinedFields({
        codigo: `WEB_${Date.now()}`,
        tipo: tipoAssinatura,
        tipoNome: plan.name,
        dataInicio: dataInicio.toISOString(),
        dataExpiracao: dataExpiracao.toISOString(),
        ativa: true,
        userId: userId,
        userName: paymentData?.name || '',
        userEmail: paymentData?.email || '',
        tokens: 10, // 10 tokens por assinatura mensal
        origem: 'site',
        planoOrigem: plan.name,
        valorPago: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
        periodicidade: isYearly ? 'anual' : 'mensal',
        pagamentoId: paymentData?.transactionId || `WEB_PAY_${Date.now()}`,
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp()
      })
      
      // Salvar no Firestore
      const assinaturaRef = doc(collection(db, 'assinaturas'))
      await setDoc(assinaturaRef, assinaturaData)
      
      console.log('✅ Assinatura criada:', assinaturaRef.id)
      
      // Atualizar dados do usuário com a assinatura
      await updateDoc(doc(db, 'usuarios', userId), {
        assinaturaAtiva: true,
        assinaturaId: assinaturaRef.id,
        planoAtual: plan.name,
        atualizadoEm: serverTimestamp()
      })
      
      return {
        success: true,
        assinaturaId: assinaturaRef.id,
        assinatura: assinaturaData
      }
    } catch (error) {
      console.error('❌ Erro ao criar assinatura:', error)
      throw error
    }
  },

  /**
   * Buscar assinatura ativa do usuário
   */
  async getActiveSubscription(userId) {
    try {
      const q = query(
        collection(db, 'assinaturas'),
        where('userId', '==', userId),
        where('ativa', '==', true)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }
      
      // Retornar a assinatura mais recente
      const assinaturas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      assinaturas.sort((a, b) => 
        new Date(b.dataExpiracao) - new Date(a.dataExpiracao)
      )
      
      return assinaturas[0]
    } catch (error) {
      console.error('❌ Erro ao buscar assinatura:', error)
      throw error
    }
  },

  /**
   * Verificar se usuário tem assinatura ativa
   */
  async hasActiveSubscription(userId) {
    try {
      const subscription = await this.getActiveSubscription(userId)
      
      if (!subscription) {
        return false
      }
      
      // Verificar se a assinatura não expirou
      const dataExpiracao = new Date(subscription.dataExpiracao)
      const agora = new Date()
      
      return dataExpiracao > agora
    } catch (error) {
      console.error('❌ Erro ao verificar assinatura:', error)
      return false
    }
  }
}

/**
 * Serviço de Pagamentos no Firestore
 */
export const firebasePaymentService = {
  /**
   * Registrar pagamento
   */
  async recordPayment(userId, paymentData) {
    try {
      const pagamentoData = removeUndefinedFields({
        userId: userId,
        userEmail: paymentData?.email || '',
        valor: paymentData?.amount || 0,
        status: paymentData?.status || 'pending',
        metodoPagamento: paymentData?.paymentMethod || 'card',
        transacaoId: paymentData?.transactionId || `WEB_TXN_${Date.now()}`,
        plano: paymentData?.plan || '',
        periodicidade: paymentData?.isYearly ? 'anual' : 'mensal',
        origem: 'site',
        criadoEm: serverTimestamp(),
        dadosCompletos: paymentData || {}
      })
      
      const pagamentoRef = doc(collection(db, 'pagamentos'))
      await setDoc(pagamentoRef, pagamentoData)
      
      console.log('✅ Pagamento registrado:', pagamentoRef.id)
      
      return {
        success: true,
        pagamentoId: pagamentoRef.id
      }
    } catch (error) {
      console.error('❌ Erro ao registrar pagamento:', error)
      throw error
    }
  }
}

/**
 * Serviço de Créditos no Firestore
 * Gerencia a compra e consumo de créditos avulsos (além da assinatura)
 */
export const firebaseCreditService = {
  /**
   * Comprar créditos (REQUER ASSINATURA ATIVA)
   * @param {string} userId - ID do usuário autenticado
   * @param {Object} creditData - Dados da compra
   * @returns {Promise<Object>}
   */
  async purchaseCredits(userId, creditData) {
    try {
      console.log('💳 Comprando créditos para usuário:', userId)
      
      // VALIDAÇÃO CRÍTICA: Verificar assinatura ativa ANTES de processar pagamento
      const hasActiveSubscription = await firebaseSubscriptionService.hasActiveSubscription(userId)
      
      if (!hasActiveSubscription) {
        throw new Error(
          'ASSINATURA ATIVA NECESSÁRIA: O app Escrita360 só libera acesso para usuários com assinatura válida. ' +
          'Adquira uma assinatura antes de comprar créditos adicionais.'
        )
      }
      
      const { quantity, amount, paymentData } = creditData
      
      // 1. Criar registro de compra de créditos
      const compraData = removeUndefinedFields({
        userId: userId,
        userEmail: paymentData?.email || '',
        quantidade: quantity,
        valorPago: amount,
        valorUnitario: amount / quantity,
        status: 'paid',
        metodoPagamento: paymentData?.paymentMethod || 'card',
        transacaoId: paymentData?.transactionId || `CREDIT_${Date.now()}`,
        tipo: 'compra_creditos',
        origem: 'site',
        criadoEm: serverTimestamp()
      })
      
      const compraRef = doc(collection(db, 'compras_creditos'))
      await setDoc(compraRef, compraData)
      
      console.log('✅ Compra de créditos registrada:', compraRef.id)
      
      // 2. Adicionar créditos à assinatura do usuário (que já foi validada)
      const assinatura = await firebaseSubscriptionService.getActiveSubscription(userId)
      
      // Assinatura sempre existirá (validação acima garante isso)
      if (!assinatura) {
        throw new Error('Erro: Assinatura não encontrada após validação')
      }
      
      // Atualizar tokens na assinatura existente
      const novoTotal = (assinatura.tokens || 0) + quantity
      
      await updateDoc(doc(db, 'assinaturas', assinatura.id), {
        tokens: novoTotal,
        ultimaCompraCreditos: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      })
      
      console.log(`✅ Créditos adicionados à assinatura: ${quantity} (Total: ${novoTotal})`)
      
      // 3. Registrar no histórico de pagamentos
      await firebasePaymentService.recordPayment(userId, {
        email: paymentData.email,
        amount: amount,
        status: 'paid',
        paymentMethod: paymentData.paymentMethod || 'card',
        transactionId: paymentData.transactionId,
        plan: `${quantity} créditos`,
        isYearly: false
      })
      
      return {
        success: true,
        compraId: compraRef.id,
        quantidade: quantity,
        novoTotal: assinatura ? (assinatura.tokens + quantity) : quantity
      }
    } catch (error) {
      console.error('❌ Erro ao comprar créditos:', error)
      throw error
    }
  },

  /**
   * Buscar total de créditos do usuário
   * Soma tokens da assinatura + créditos avulsos
   */
  async getTotalCredits(userId) {
    try {
      let totalCreditos = 0
      
      // 1. Buscar tokens da assinatura ativa
      const assinatura = await firebaseSubscriptionService.getActiveSubscription(userId)
      if (assinatura && assinatura.ativa) {
        totalCreditos += assinatura.tokens || 0
      }
      
      // 2. Buscar créditos avulsos
      const q = query(
        collection(db, 'creditos_avulsos'),
        where('userId', '==', userId),
        where('ativo', '==', true)
      )
      
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(doc => {
        const data = doc.data()
        totalCreditos += data.tokens || 0
      })
      
      console.log(`📊 Total de créditos para ${userId}: ${totalCreditos}`)
      
      return {
        total: totalCreditos,
        assinatura: assinatura?.tokens || 0,
        avulsos: totalCreditos - (assinatura?.tokens || 0)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar créditos:', error)
      throw error
    }
  },

  /**
   * Consumir créditos
   * Usado quando o usuário usa uma funcionalidade que gasta créditos
   */
  async consumeCredits(userId, quantity) {
    try {
      console.log(`💸 Consumindo ${quantity} créditos do usuário ${userId}`)
      
      // 1. Buscar assinatura ativa
      const assinatura = await firebaseSubscriptionService.getActiveSubscription(userId)
      
      if (assinatura && assinatura.tokens >= quantity) {
        // Descontar da assinatura
        const novoTotal = assinatura.tokens - quantity
        
        await updateDoc(doc(db, 'assinaturas', assinatura.id), {
          tokens: novoTotal,
          ultimoConsumo: serverTimestamp(),
          atualizadoEm: serverTimestamp()
        })
        
        console.log(`✅ Créditos consumidos da assinatura: ${quantity} (Restante: ${novoTotal})`)
        return { success: true, restante: novoTotal }
      }
      
      // 2. Se não tem assinatura ou não tem tokens suficientes, buscar créditos avulsos
      const q = query(
        collection(db, 'creditos_avulsos'),
        where('userId', '==', userId),
        where('ativo', '==', true)
      )
      
      const querySnapshot = await getDocs(q)
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data()
        const tokensDisponiveis = data.tokens || 0
        
        if (tokensDisponiveis >= quantity) {
          const novoTotal = tokensDisponiveis - quantity
          
          if (novoTotal === 0) {
            // Se zerou, desativar
            await updateDoc(doc(db, 'creditos_avulsos', docSnapshot.id), {
              tokens: 0,
              ativo: false,
              atualizadoEm: serverTimestamp()
            })
          } else {
            // Atualizar quantidade
            await updateDoc(doc(db, 'creditos_avulsos', docSnapshot.id), {
              tokens: novoTotal,
              atualizadoEm: serverTimestamp()
            })
          }
          
          console.log(`✅ Créditos avulsos consumidos: ${quantity} (Restante: ${novoTotal})`)
          return { success: true, restante: novoTotal }
        }
      }
      
      // Se chegou aqui, não tem créditos suficientes
      console.log('❌ Créditos insuficientes')
      return {
        success: false,
        error: 'Créditos insuficientes'
      }
    } catch (error) {
      console.error('❌ Erro ao consumir créditos:', error)
      throw error
    }
  },

  /**
   * Histórico de compras de créditos
   */
  async getPurchaseHistory(userId) {
    try {
      const q = query(
        collection(db, 'compras_creditos'),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(q)
      
      const compras = []
      querySnapshot.forEach(doc => {
        compras.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      // Ordenar por data (mais recente primeiro)
      compras.sort((a, b) => {
        const aDate = a.criadoEm?.toDate?.() || new Date(0)
        const bDate = b.criadoEm?.toDate?.() || new Date(0)
        return bDate - aDate
      })
      
      return compras
    } catch (error) {
      console.error('❌ Erro ao buscar histórico de compras:', error)
      throw error
    }
  }
}

export { auth, db }
