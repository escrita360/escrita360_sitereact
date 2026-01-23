// Firebase Configuration and Services
// Integração com múltiplos projetos Firebase baseado no tipo de plano

import { initializeApp, getApps, getApp } from 'firebase/app'
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
  serverTimestamp,
  orderBy
} from 'firebase/firestore'

// Configuração do Firebase para ALUNOS (escrita360aluno)
const firebaseConfigAluno = {
  apiKey: 'AIzaSyBvRxURO1FNwb1ItnlwSwaPKLtlS5sLVjM',
  authDomain: 'escrita360aluno.firebaseapp.com',
  projectId: 'escrita360aluno',
  storageBucket: 'escrita360aluno.firebasestorage.app',
  messagingSenderId: '167249838189',
  appId: '1:167249838189:web:0ca9443af25880fd007f64',
  measurementId: 'G-KG006BD62G'
}

// Configuração do Firebase para PROFESSORES (indivprof)
const firebaseConfigProfessor = {
  apiKey: 'AIzaSyAky9i1wlxY9yUpzAB-CRJvc9Rlp5gHEwY',
  authDomain: 'indivprof.firebaseapp.com',
  projectId: 'indivprof',
  storageBucket: 'indivprof.firebasestorage.app',
  messagingSenderId: '799589413678',
  appId: '1:799589413678:web:3edc556a8f1456931dc0bf',
  measurementId: 'G-M4VM8YLHHF'
}

// Inicializar Firebase Apps
const getOrCreateApp = (config, name) => {
  try {
    return getApp(name)
  } catch {
    return initializeApp(config, name)
  }
}

// App padrão (aluno) - usado para operações gerais do site
const appAluno = getApps().length === 0 
  ? initializeApp(firebaseConfigAluno) 
  : getApp()

// App para professores
const appProfessor = getOrCreateApp(firebaseConfigProfessor, 'professor')

// Auth e Firestore para cada projeto
const authAluno = getAuth(appAluno)
const dbAluno = getFirestore(appAluno)

const authProfessor = getAuth(appProfessor)
const dbProfessor = getFirestore(appProfessor)

// Exportar referências padrão (aluno) para compatibilidade
const auth = authAluno
const db = dbAluno

console.log('✅ Firebase inicializado - projeto aluno:', firebaseConfigAluno.projectId)
console.log('✅ Firebase inicializado - projeto professor:', firebaseConfigProfessor.projectId)

/**
 * Helper: Obtém Auth e DB baseado no tipo de plano/audience
 */
const getFirebaseForPlan = (audience) => {
  const isProfessor = audience === 'professores' || audience === 'docentes' || audience === 'professor'
  return {
    auth: isProfessor ? authProfessor : authAluno,
    db: isProfessor ? dbProfessor : dbAluno,
    projectId: isProfessor ? firebaseConfigProfessor.projectId : firebaseConfigAluno.projectId
  }
}

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
      .filter(([, value]) => value !== undefined)
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
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {Object} userData - Dados adicionais do usuário
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async register(email, password, userData = {}, audience = 'estudantes') {
    try {
      // Selecionar projeto Firebase baseado no audience
      const { auth: targetAuth, db: targetDb, projectId } = getFirebaseForPlan(audience)
      
      console.log(`🔐 Criando conta Firebase para: ${email} no projeto: ${projectId}`)
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(targetAuth, email, password)
      const user = userCredential.user
      
      console.log(`✅ Conta Firebase criada - UID: ${user.uid} no projeto: ${projectId}`)
      
      // Salvar dados do usuário no Firestore
      const userDocData = removeUndefinedFields({
        uid: user.uid,
        email: user.email,
        nome: userData.name || email.split('@')[0],
        cpf: userData.cpf || '',
        telefone: userData.phone || '',
        origem: 'site', // Identifica que veio do site
        tipoPlano: audience === 'professores' ? 'professor' : 'aluno',
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        emailVerificado: user.emailVerified,
        ...userData
      })
      
      await setDoc(doc(targetDb, 'usuarios', user.uid), userDocData)
      console.log(`✅ Dados do usuário salvos no Firestore (${projectId})`)
      
      return {
        success: true,
        uid: user.uid,
        email: user.email,
        user: userDocData,
        projectId: projectId
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
   * @param {string} userId - ID do usuário
   * @param {Object} subscriptionData - Dados da assinatura
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async createSubscription(userId, subscriptionData, audience = 'estudantes') {
    try {
      // Selecionar projeto Firebase baseado no audience
      const { db: targetDb, projectId } = getFirebaseForPlan(audience)
      
      console.log(`📝 Criando assinatura no Firestore (${projectId}) para:`, userId)
      
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
        tokens: plan.credits || 10, // Usar créditos do plano ou 10 como padrão
        origem: 'site',
        planoOrigem: plan.name,
        tipoPlano: audience === 'professores' ? 'professor' : 'aluno',
        valorPago: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
        periodicidade: isYearly ? 'anual' : 'mensal',
        pagamentoId: paymentData?.transactionId || `WEB_PAY_${Date.now()}`,
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp()
      })
      
      // Salvar no Firestore do projeto correto
      const assinaturaRef = doc(collection(targetDb, 'assinaturas'))
      await setDoc(assinaturaRef, assinaturaData)
      
      console.log(`✅ Assinatura criada no projeto ${projectId}:`, assinaturaRef.id)
      
      // Atualizar dados do usuário com a assinatura
      await updateDoc(doc(targetDb, 'usuarios', userId), {
        assinaturaAtiva: true,
        assinaturaId: assinaturaRef.id,
        planoAtual: plan.name,
        atualizadoEm: serverTimestamp()
      })
      
      return {
        success: true,
        assinaturaId: assinaturaRef.id,
        assinatura: assinaturaData,
        projectId: projectId
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
 * Serviço de Pagamentos Firebase
 * Gerencia métodos de pagamento, cartões salvos e transações
 */
export const firebasePaymentService = {
  /**
   * Adicionar método de pagamento
   * @param {string} userId - ID do usuário
   * @param {Object} paymentMethodData - Dados do método de pagamento
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async addPaymentMethod(userId, paymentMethodData, audience = 'estudantes') {
    try {
      const { db: targetDb, projectId } = getFirebaseForPlan(audience)

      console.log(`💳 Adicionando método de pagamento para: ${userId} no projeto: ${projectId}`)

      const paymentMethodId = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const paymentMethodDoc = {
        id: paymentMethodId,
        userId: userId,
        type: paymentMethodData.type, // 'card', 'pix', 'boleto'
        isDefault: paymentMethodData.isDefault || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...paymentMethodData
      }

      // Se for cartão, mascarar dados sensíveis
      if (paymentMethodData.type === 'card') {
        paymentMethodDoc.card = {
          last4: paymentMethodData.card.number.slice(-4),
          brand: paymentMethodData.card.brand,
          expiryMonth: paymentMethodData.card.expiryMonth,
          expiryYear: paymentMethodData.card.expiryYear,
          holderName: paymentMethodData.card.holderName
        }
        // Remover dados sensíveis que não devem ser salvos
        delete paymentMethodDoc.card.number
        delete paymentMethodDoc.card.cvv
      }

      // Salvar método de pagamento
      await setDoc(doc(targetDb, 'payment_methods', paymentMethodId), paymentMethodDoc)

      // Se for padrão, remover padrão dos outros métodos
      if (paymentMethodData.isDefault) {
        await this.setDefaultPaymentMethod(userId, paymentMethodId, audience)
      }

      console.log(`✅ Método de pagamento adicionado: ${paymentMethodId}`)

      return {
        success: true,
        paymentMethodId: paymentMethodId,
        paymentMethod: paymentMethodDoc
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar método de pagamento:', error)
      throw error
    }
  },

  /**
   * Buscar métodos de pagamento do usuário
   * @param {string} userId - ID do usuário
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async getPaymentMethods(userId, audience = 'estudantes') {
    try {
      const { db: targetDb } = getFirebaseForPlan(audience)

      const q = query(
        collection(targetDb, 'payment_methods'),
        where('userId', '==', userId)
      )

      const querySnapshot = await getDocs(q)
      const paymentMethods = []

      querySnapshot.forEach(doc => {
        paymentMethods.push({
          id: doc.id,
          ...doc.data()
        })
      })

      // Ordenar por data de criação (mais recente primeiro)
      paymentMethods.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || new Date(0)
        const bDate = b.createdAt?.toDate?.() || new Date(0)
        return bDate - aDate
      })

      return paymentMethods
    } catch (error) {
      console.error('❌ Erro ao buscar métodos de pagamento:', error)
      throw error
    }
  },

  /**
   * Definir método de pagamento padrão
   * @param {string} userId - ID do usuário
   * @param {string} paymentMethodId - ID do método de pagamento
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async setDefaultPaymentMethod(userId, paymentMethodId, audience = 'estudantes') {
    try {
      const { db: targetDb } = getFirebaseForPlan(audience)

      console.log(`🎯 Definindo método de pagamento padrão: ${paymentMethodId}`)

      // Buscar todos os métodos do usuário
      const paymentMethods = await this.getPaymentMethods(userId, audience)

      // Atualizar cada método: definir como padrão apenas o selecionado
      const updatePromises = paymentMethods.map(method => {
        const isDefault = method.id === paymentMethodId
        return updateDoc(doc(targetDb, 'payment_methods', method.id), {
          isDefault: isDefault,
          updatedAt: serverTimestamp()
        })
      })

      await Promise.all(updatePromises)

      console.log(`✅ Método de pagamento padrão atualizado`)

      return { success: true }
    } catch (error) {
      console.error('❌ Erro ao definir método de pagamento padrão:', error)
      throw error
    }
  },

  /**
   * Remover método de pagamento
   * @param {string} userId - ID do usuário
   * @param {string} paymentMethodId - ID do método de pagamento
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async removePaymentMethod(userId, paymentMethodId, audience = 'estudantes') {
    try {
      const { db: targetDb } = getFirebaseForPlan(audience)

      console.log(`🗑️ Removendo método de pagamento: ${paymentMethodId}`)

      // Verificar se o método pertence ao usuário
      const paymentMethodDoc = await getDoc(doc(targetDb, 'payment_methods', paymentMethodId))

      if (!paymentMethodDoc.exists()) {
        throw new Error('Método de pagamento não encontrado')
      }

      const paymentMethod = paymentMethodDoc.data()

      if (paymentMethod.userId !== userId) {
        throw new Error('Método de pagamento não pertence ao usuário')
      }

      // Remover o método
      await updateDoc(doc(targetDb, 'payment_methods', paymentMethodId), {
        deleted: true,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      console.log(`✅ Método de pagamento removido`)

      return { success: true }
    } catch (error) {
      console.error('❌ Erro ao remover método de pagamento:', error)
      throw error
    }
  },

  /**
   * Efetuar pagamento
   * @param {string} userId - ID do usuário
   * @param {Object} paymentData - Dados do pagamento
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async processPayment(userId, paymentData, audience = 'estudantes') {
    try {
      const { db: targetDb, projectId } = getFirebaseForPlan(audience)

      console.log(`💰 Processando pagamento para: ${userId} no projeto: ${projectId}`)

      const {
        amount,
        currency = 'BRL',
        paymentMethodId,
        description,
        metadata = {}
      } = paymentData

      // Buscar método de pagamento
      let paymentMethod = null
      if (paymentMethodId) {
        const paymentMethodDoc = await getDoc(doc(targetDb, 'payment_methods', paymentMethodId))
        if (paymentMethodDoc.exists()) {
          paymentMethod = {
            id: paymentMethodDoc.id,
            ...paymentMethodDoc.data()
          }
        }
      }

      // Se não encontrou método salvo, usar dados diretos (para pagamentos únicos)
      if (!paymentMethod && paymentData.paymentMethod) {
        paymentMethod = paymentData.paymentMethod
      }

      if (!paymentMethod) {
        throw new Error('Método de pagamento não encontrado')
      }

      // Criar registro de transação
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const transactionData = {
        id: transactionId,
        userId: userId,
        amount: amount,
        currency: currency,
        paymentMethodId: paymentMethodId,
        paymentMethodType: paymentMethod.type,
        description: description,
        status: 'pending', // pending, processing, completed, failed, cancelled
        metadata: metadata,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Salvar transação no Firestore
      await setDoc(doc(targetDb, 'transactions', transactionId), transactionData)

      console.log(`📝 Transação criada: ${transactionId}`)

      // Aqui seria integrada com PagBank ou outro gateway
      // Por enquanto, simulamos um processamento bem-sucedido
      try {
        // TODO: Integrar com PagBank API
        // const pagBankResult = await processWithPagBank(paymentData)

        // Simulação de processamento
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Atualizar status da transação
        await updateDoc(doc(targetDb, 'transactions', transactionId), {
          status: 'completed',
          processedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          // Adicionar dados do gateway de pagamento
          gatewayResponse: {
            transactionId: `pagbank_${Date.now()}`,
            status: 'approved'
          }
        })

        console.log(`✅ Pagamento processado com sucesso: ${transactionId}`)

        return {
          success: true,
          transactionId: transactionId,
          status: 'completed',
          message: 'Pagamento processado com sucesso'
        }

      } catch (gatewayError) {
        // Atualizar status em caso de erro
        await updateDoc(doc(targetDb, 'transactions', transactionId), {
          status: 'failed',
          error: gatewayError.message,
          updatedAt: serverTimestamp()
        })

        throw new Error(`Falha no processamento do pagamento: ${gatewayError.message}`)
      }

    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error)
      throw error
    }
  },

  /**
   * Buscar histórico de transações do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} options - Opções de filtro e paginação
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async getTransactionHistory(userId, options = {}, audience = 'estudantes') {
    try {
      const { db: targetDb } = getFirebaseForPlan(audience)

      const { limit = 20, status, startAfter } = options

      let q = query(
        collection(targetDb, 'transactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      )

      if (status) {
        q = query(q, where('status', '==', status))
      }

      if (startAfter) {
        q = query(q, startAfter(startAfter))
      }

      const querySnapshot = await getDocs(q)
      const transactions = []

      querySnapshot.forEach(doc => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        })
      })

      return transactions
    } catch (error) {
      console.error('❌ Erro ao buscar histórico de transações:', error)
      throw error
    }
  },
  /**
   * Registrar pagamento
   * @param {string} userId - ID do usuário
   * @param {Object} paymentData - Dados do pagamento
   * @param {string} audience - Tipo de público ('estudantes' ou 'professores')
   */
  async recordPayment(userId, paymentData, audience = 'estudantes') {
    try {
      // Selecionar projeto Firebase baseado no audience
      const { db: targetDb, projectId } = getFirebaseForPlan(audience)
      
      const pagamentoData = removeUndefinedFields({
        userId: userId,
        userEmail: paymentData?.email || '',
        valor: paymentData?.amount || 0,
        status: paymentData?.status || 'pending',
        metodoPagamento: paymentData?.paymentMethod || 'card',
        transacaoId: paymentData?.transactionId || `WEB_TXN_${Date.now()}`,
        plano: paymentData?.plan || '',
        periodicidade: paymentData?.isYearly ? 'anual' : 'mensal',
        tipoPlano: audience === 'professores' ? 'professor' : 'aluno',
        origem: 'site',
        criadoEm: serverTimestamp(),
        dadosCompletos: paymentData || {}
      })
      
      const pagamentoRef = doc(collection(targetDb, 'pagamentos'))
      await setDoc(pagamentoRef, pagamentoData)
      
      console.log(`✅ Pagamento registrado no projeto ${projectId}:`, pagamentoRef.id)
      
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

// Exportar referências padrão e helpers
export { auth, db, getFirebaseForPlan, authAluno, dbAluno, authProfessor, dbProfessor }
