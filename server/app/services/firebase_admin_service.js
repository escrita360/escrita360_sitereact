// Firebase Admin Service - Stub implementation
// This is a placeholder until Firebase Admin SDK is properly configured

class FirebaseAdminService {
    constructor() {
        console.log('⚠️ Firebase Admin Service is using stub implementation');
    }

    async getStatistics() {
        return {
            totalUsers: 0,
            totalSubscriptions: 0,
            totalPayments: 0,
            message: 'Firebase Admin not configured'
        };
    }

    async listUsers(maxResults = 100, pageToken) {
        return {
            users: [],
            pageToken: null,
            message: 'Firebase Admin not configured'
        };
    }

    async getUserByUid(uid) {
        return {
            uid,
            email: 'stub@example.com',
            displayName: 'Stub User',
            disabled: false,
            message: 'Firebase Admin not configured'
        };
    }

    async getUserSubscriptions(uid) {
        return [];
    }

    async setUserDisabled(uid, disabled) {
        console.log(`Stub: Would ${disabled ? 'disable' : 'enable'} user ${uid}`);
        return true;
    }

    async setCustomClaims(uid, claims) {
        console.log(`Stub: Would set claims for user ${uid}:`, claims);
        return true;
    }

    async listAllSubscriptions(limit = 50, startAfter) {
        return {
            subscriptions: [],
            lastDoc: null,
            message: 'Firebase Admin not configured'
        };
    }

    async updateSubscriptionStatus(subscriptionId, status) {
        console.log(`Stub: Would update subscription ${subscriptionId} to status ${status}`);
        return true;
    }

    async listAllPayments(limit = 50, startAfter) {
        return {
            payments: [],
            lastDoc: null,
            message: 'Firebase Admin not configured'
        };
    }
}

module.exports = FirebaseAdminService;

let firebaseInitialized = false;

/**
 * Inicializa Firebase Admin SDK
 */
function initializeFirebase() {
  if (firebaseInitialized) {
    return admin;
  }

  try {
    // Verificar se já foi inicializado
    if (admin.apps.length > 0) {
      firebaseInitialized = true;
      return admin;
    }

    // Inicializar com credenciais do ambiente ou arquivo
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } else {
      // Modo desenvolvimento - usar credenciais padrão
      console.warn('⚠️  Firebase Admin rodando sem credenciais de serviço');
      admin.initializeApp();
    }

    firebaseInitialized = true;
    console.log('✅ Firebase Admin inicializado');
    return admin;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    throw error;
  }
}

class FirebaseAdminService {
  constructor() {
    this.admin = initializeFirebase();
    this.db = this.admin.firestore();
  }

  /**
   * Lista todos os usuários
   */
  async listUsers(maxResults = 100, pageToken = null) {
    try {
      const listUsersResult = await this.admin.auth().listUsers(maxResults, pageToken);
      
      return {
        users: listUsersResult.users.map(user => ({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          disabled: user.disabled,
          emailVerified: user.emailVerified,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
          providerData: user.providerData
        })),
        pageToken: listUsersResult.pageToken
      };
    } catch (error) {
      console.error('❌ Erro ao listar usuários:', error);
      throw error;
    }
  }

  /**
   * Busca usuário por UID
   */
  async getUserByUid(uid) {
    try {
      const user = await this.admin.auth().getUser(uid);
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        disabled: user.disabled,
        emailVerified: user.emailVerified,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        customClaims: user.customClaims,
        providerData: user.providerData
      };
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      throw error;
    }
  }

  /**
   * Busca assinaturas de um usuário
   */
  async getUserSubscriptions(uid) {
    try {
      const subscriptionsRef = this.db.collection('subscriptions');
      const snapshot = await subscriptionsRef.where('userId', '==', uid).get();
      
      const subscriptions = [];
      snapshot.forEach(doc => {
        subscriptions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return subscriptions;
    } catch (error) {
      console.error('❌ Erro ao buscar assinaturas:', error);
      throw error;
    }
  }

  /**
   * Lista todas as assinaturas
   */
  async listAllSubscriptions(limit = 50, startAfter = null) {
    try {
      let query = this.db.collection('subscriptions')
        .orderBy('createdAt', 'desc')
        .limit(limit);

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      const snapshot = await query.get();
      
      const subscriptions = [];
      snapshot.forEach(doc => {
        subscriptions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        subscriptions,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('❌ Erro ao listar assinaturas:', error);
      throw error;
    }
  }

  /**
   * Lista todos os pagamentos
   */
  async listAllPayments(limit = 50, startAfter = null) {
    try {
      let query = this.db.collection('payments')
        .orderBy('createdAt', 'desc')
        .limit(limit);

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      const snapshot = await query.get();
      
      const payments = [];
      snapshot.forEach(doc => {
        payments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        payments,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('❌ Erro ao listar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Atualiza status de assinatura
   */
  async updateSubscriptionStatus(subscriptionId, status) {
    try {
      await this.db.collection('subscriptions').doc(subscriptionId).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Status da assinatura ${subscriptionId} atualizado para ${status}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status da assinatura:', error);
      throw error;
    }
  }

  /**
   * Desabilita/habilita usuário
   */
  async setUserDisabled(uid, disabled) {
    try {
      await this.admin.auth().updateUser(uid, { disabled });
      console.log(`✅ Usuário ${uid} ${disabled ? 'desabilitado' : 'habilitado'}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  /**
   * Define claims customizados (ex: admin role)
   */
  async setCustomClaims(uid, claims) {
    try {
      await this.admin.auth().setCustomUserClaims(uid, claims);
      console.log(`✅ Claims customizados definidos para ${uid}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao definir claims:', error);
      throw error;
    }
  }

  /**
   * Estatísticas gerais
   */
  async getStatistics() {
    try {
      // Contar usuários (aproximado)
      const usersResult = await this.admin.auth().listUsers(1000);
      const totalUsers = usersResult.users.length;

      // Contar assinaturas ativas
      const activeSubsSnapshot = await this.db.collection('subscriptions')
        .where('status', '==', 'active')
        .get();
      const activeSubscriptions = activeSubsSnapshot.size;

      // Contar pagamentos do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const paymentsSnapshot = await this.db.collection('payments')
        .where('createdAt', '>=', startOfMonth)
        .get();
      
      let monthlyRevenue = 0;
      paymentsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'paid' || data.status === 'PAID') {
          monthlyRevenue += data.amount || 0;
        }
      });

      return {
        totalUsers,
        activeSubscriptions,
        monthlyPayments: paymentsSnapshot.size,
        monthlyRevenue: monthlyRevenue / 100 // Converter centavos para reais
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}

module.exports = FirebaseAdminService;
