/**
 * Firebase Multi-Project Service
 * 
 * Serviço para criar contas de usuário em múltiplos projetos Firebase
 * baseado no tipo de plano comprado (aluno ou professor).
 * 
 * Projetos:
 * - escrita360aluno: Para alunos individuais
 * - indivprof: Para professores individuais
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

class FirebaseMultiProjectService {
    constructor() {
        this.apps = {};
        this.initialized = false;
    }

    /**
     * Inicializa as conexões com os projetos Firebase
     */
    async initialize() {
        if (this.initialized) {
            return;
        }

        console.log('🔥 Inicializando Firebase Multi-Project Service...');

        try {
            // Configuração do projeto ALUNO (escrita360aluno)
            await this._initializeProject('aluno', {
                projectId: process.env.FIREBASE_ALUNO_PROJECT_ID || 'escrita360aluno',
                serviceAccountPath: process.env.FIREBASE_ALUNO_SERVICE_ACCOUNT_PATH,
                serviceAccountJson: process.env.FIREBASE_ALUNO_SERVICE_ACCOUNT_JSON
            });

            // Configuração do projeto PROFESSOR (indivprof)
            await this._initializeProject('professor', {
                projectId: process.env.FIREBASE_PROFESSOR_PROJECT_ID || 'indivprof',
                serviceAccountPath: process.env.FIREBASE_PROFESSOR_SERVICE_ACCOUNT_PATH,
                serviceAccountJson: process.env.FIREBASE_PROFESSOR_SERVICE_ACCOUNT_JSON
            });

            this.initialized = true;
            console.log('✅ Firebase Multi-Project Service inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase Multi-Project Service:', error.message);
            throw error;
        }
    }

    /**
     * Inicializa um projeto Firebase específico
     */
    async _initializeProject(name, config) {
        try {
            // Verifica se já existe uma app com esse nome
            try {
                this.apps[name] = admin.app(name);
                console.log(`✅ Firebase App '${name}' já estava inicializada`);
                return;
            } catch (e) {
                // App não existe, vamos criar
            }

            let credential;

            // Tenta carregar credenciais do arquivo
            if (config.serviceAccountPath && fs.existsSync(config.serviceAccountPath)) {
                const serviceAccount = require(path.resolve(config.serviceAccountPath));
                credential = admin.credential.cert(serviceAccount);
                console.log(`📁 Carregando credenciais do arquivo: ${config.serviceAccountPath}`);
            }
            // Tenta carregar credenciais do JSON inline (base64 encoded ou JSON string)
            else if (config.serviceAccountJson) {
                let serviceAccount;
                try {
                    // Tenta decodificar de Base64
                    const decoded = Buffer.from(config.serviceAccountJson, 'base64').toString('utf-8');
                    serviceAccount = JSON.parse(decoded);
                } catch (e) {
                    // Se falhar, tenta parse direto
                    serviceAccount = JSON.parse(config.serviceAccountJson);
                }
                credential = admin.credential.cert(serviceAccount);
                console.log(`🔐 Carregando credenciais do JSON inline para '${name}'`);
            }
            // Fallback para credentials padrão (útil em ambientes Google Cloud)
            else {
                credential = admin.credential.applicationDefault();
                console.log(`🌐 Usando Application Default Credentials para '${name}'`);
            }

            this.apps[name] = admin.initializeApp({
                credential: credential,
                projectId: config.projectId
            }, name);

            console.log(`✅ Firebase App '${name}' inicializada para projeto '${config.projectId}'`);
        } catch (error) {
            console.error(`❌ Erro ao inicializar projeto '${name}':`, error.message);
            throw error;
        }
    }

    /**
     * Cria um usuário no projeto apropriado baseado no tipo de plano
     * 
     * @param {Object} userData - Dados do usuário
     * @param {string} userData.email - Email do usuário
     * @param {string} userData.password - Senha do usuário
     * @param {string} userData.displayName - Nome de exibição
     * @param {string} userData.planType - Tipo do plano ('aluno' ou 'professor')
     * @param {Object} userData.subscriptionData - Dados da assinatura/pagamento
     * @returns {Promise<Object>} Dados do usuário criado
     */
    async createUserForPlan(userData) {
        const { email, password, displayName, planType, subscriptionData } = userData;

        if (!this.initialized) {
            await this.initialize();
        }

        // Determinar qual projeto usar baseado no tipo de plano
        const projectKey = this._getProjectKeyFromPlan(planType);
        
        if (!this.apps[projectKey]) {
            throw new Error(`Projeto Firebase '${projectKey}' não está configurado`);
        }

        console.log(`👤 Criando usuário no projeto '${projectKey}' para plano '${planType}'`);

        try {
            const auth = this.apps[projectKey].auth();
            const firestore = this.apps[projectKey].firestore();

            // Verificar se o usuário já existe
            let existingUser = null;
            try {
                existingUser = await auth.getUserByEmail(email);
                console.log(`⚠️ Usuário já existe: ${existingUser.uid}`);
            } catch (error) {
                if (error.code !== 'auth/user-not-found') {
                    throw error;
                }
            }

            let userRecord;
            if (existingUser) {
                // Atualizar usuário existente
                userRecord = await auth.updateUser(existingUser.uid, {
                    displayName: displayName || existingUser.displayName,
                    // Não atualiza a senha se o usuário já existe
                });
                console.log(`📝 Usuário existente atualizado: ${userRecord.uid}`);
            } else {
                // Criar novo usuário
                userRecord = await auth.createUser({
                    email: email,
                    password: password,
                    displayName: displayName || email.split('@')[0],
                    emailVerified: false
                });
                console.log(`✅ Novo usuário criado: ${userRecord.uid}`);
            }

            // Definir custom claims para identificar tipo de plano
            await auth.setCustomUserClaims(userRecord.uid, {
                planType: planType,
                subscriptionStatus: 'active',
                createdAt: new Date().toISOString()
            });

            // Salvar dados da assinatura no Firestore
            await firestore.collection('users').doc(userRecord.uid).set({
                email: email,
                displayName: displayName || email.split('@')[0],
                planType: planType,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                subscription: {
                    status: 'active',
                    startDate: admin.firestore.FieldValue.serverTimestamp(),
                    ...subscriptionData
                }
            }, { merge: true });

            console.log(`💾 Dados salvos no Firestore para usuário ${userRecord.uid}`);

            return {
                success: true,
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                projectId: this.apps[projectKey].options.projectId,
                planType: planType
            };
        } catch (error) {
            console.error(`❌ Erro ao criar usuário no projeto '${projectKey}':`, error.message);
            throw error;
        }
    }

    /**
     * Determina qual projeto usar baseado no nome do plano
     */
    _getProjectKeyFromPlan(planType) {
        const planTypeLower = (planType || '').toLowerCase();
        
        // Mapeamento de planos para projetos
        const planToProject = {
            'aluno': 'aluno',
            'aluno_individual': 'aluno',
            'aluno_mensal': 'aluno',
            'aluno_anual': 'aluno',
            'estudante': 'aluno',
            'student': 'aluno',
            
            'professor': 'professor',
            'professor_individual': 'professor',
            'professor_mensal': 'professor',
            'professor_anual': 'professor',
            'teacher': 'professor',
            'docente': 'professor'
        };

        return planToProject[planTypeLower] || 'aluno'; // Default para aluno
    }

    /**
     * Atualiza o status da assinatura de um usuário
     */
    async updateSubscriptionStatus(email, planType, status, subscriptionData = {}) {
        if (!this.initialized) {
            await this.initialize();
        }

        const projectKey = this._getProjectKeyFromPlan(planType);
        
        if (!this.apps[projectKey]) {
            throw new Error(`Projeto Firebase '${projectKey}' não está configurado`);
        }

        try {
            const auth = this.apps[projectKey].auth();
            const firestore = this.apps[projectKey].firestore();

            // Buscar usuário pelo email
            const userRecord = await auth.getUserByEmail(email);

            // Atualizar custom claims
            const currentClaims = userRecord.customClaims || {};
            await auth.setCustomUserClaims(userRecord.uid, {
                ...currentClaims,
                subscriptionStatus: status,
                lastUpdated: new Date().toISOString()
            });

            // Atualizar no Firestore
            await firestore.collection('users').doc(userRecord.uid).update({
                'subscription.status': status,
                'subscription.lastUpdated': admin.firestore.FieldValue.serverTimestamp(),
                ...subscriptionData
            });

            console.log(`✅ Status da assinatura atualizado para '${status}' - usuário: ${userRecord.uid}`);

            return {
                success: true,
                uid: userRecord.uid,
                email: email,
                status: status
            };
        } catch (error) {
            console.error(`❌ Erro ao atualizar status da assinatura:`, error.message);
            throw error;
        }
    }

    /**
     * Desativa/suspende um usuário
     */
    async disableUser(email, planType) {
        if (!this.initialized) {
            await this.initialize();
        }

        const projectKey = this._getProjectKeyFromPlan(planType);
        
        if (!this.apps[projectKey]) {
            throw new Error(`Projeto Firebase '${projectKey}' não está configurado`);
        }

        try {
            const auth = this.apps[projectKey].auth();
            const firestore = this.apps[projectKey].firestore();

            const userRecord = await auth.getUserByEmail(email);
            
            await auth.updateUser(userRecord.uid, { disabled: true });
            
            await firestore.collection('users').doc(userRecord.uid).update({
                'subscription.status': 'disabled',
                'subscription.disabledAt': admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`🔒 Usuário desativado: ${userRecord.uid}`);

            return { success: true, uid: userRecord.uid };
        } catch (error) {
            console.error(`❌ Erro ao desativar usuário:`, error.message);
            throw error;
        }
    }

    /**
     * Reativa um usuário
     */
    async enableUser(email, planType) {
        if (!this.initialized) {
            await this.initialize();
        }

        const projectKey = this._getProjectKeyFromPlan(planType);
        
        if (!this.apps[projectKey]) {
            throw new Error(`Projeto Firebase '${projectKey}' não está configurado`);
        }

        try {
            const auth = this.apps[projectKey].auth();
            const firestore = this.apps[projectKey].firestore();

            const userRecord = await auth.getUserByEmail(email);
            
            await auth.updateUser(userRecord.uid, { disabled: false });
            
            await firestore.collection('users').doc(userRecord.uid).update({
                'subscription.status': 'active',
                'subscription.reactivatedAt': admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`🔓 Usuário reativado: ${userRecord.uid}`);

            return { success: true, uid: userRecord.uid };
        } catch (error) {
            console.error(`❌ Erro ao reativar usuário:`, error.message);
            throw error;
        }
    }
}

module.exports = FirebaseMultiProjectService;
