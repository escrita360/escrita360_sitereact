const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Usuários locais em memória (em produção, use banco de dados)
const USERS_DB = [
    {
        id: 1,
        email: 'admin@escrita360.com',
        password: '$2b$10$G5umsLEdBInSh4.1iN4QE.rS7SgfleadR6E/wTL11J2EbugU8jdfm', // admin123
        role: 'admin',
        name: 'Administrador',
        createdAt: new Date().toISOString()
    }
];

class LocalAuthService {
    constructor() {
        this.users = [...USERS_DB];
        this.secretKey = process.env.JWT_SECRET_KEY || 'jwt_secret_dev_12345';
        console.log('🔐 Local Auth Service inicializado');
        console.log('👤 Usuário admin padrão: admin@escrita360.com / admin123');
    }

    /**
     * Autentica usuário com email e senha
     */
    async login(email, password) {
        try {
            const user = this.users.find(u => u.email === email);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Senha incorreta');
            }

            // Gerar JWT token
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role,
                    name: user.name
                },
                this.secretKey,
                { expiresIn: '24h' }
            );

            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            };
        } catch (error) {
            console.error('❌ Erro no login:', error.message);
            throw error;
        }
    }

    /**
     * Verifica se token JWT é válido
     */
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            const user = this.users.find(u => u.id === decoded.id);
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            };
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    /**
     * Cria novo usuário
     */
    async createUser(userData) {
        try {
            const { email, password, name, role = 'user' } = userData;

            // Verificar se email já existe
            const existingUser = this.users.find(u => u.email === email);
            if (existingUser) {
                throw new Error('Email já cadastrado');
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                id: this.users.length + 1,
                email,
                password: hashedPassword,
                name,
                role,
                createdAt: new Date().toISOString()
            };

            this.users.push(newUser);

            return {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                createdAt: newUser.createdAt
            };
        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error.message);
            throw error;
        }
    }

    /**
     * Lista todos os usuários (sem senhas)
     */
    getAllUsers() {
        return this.users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        }));
    }

    /**
     * Busca usuário por ID
     */
    getUserById(id) {
        const user = this.users.find(u => u.id === parseInt(id));
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        };
    }

    /**
     * Atualiza dados do usuário
     */
    async updateUser(id, updates) {
        const userIndex = this.users.findIndex(u => u.id === parseInt(id));
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        const user = this.users[userIndex];
        
        // Se atualizando senha, fazer hash
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        this.users[userIndex] = { ...user, ...updates };

        return {
            id: this.users[userIndex].id,
            email: this.users[userIndex].email,
            name: this.users[userIndex].name,
            role: this.users[userIndex].role
        };
    }

    /**
     * Remove usuário
     */
    deleteUser(id) {
        const userIndex = this.users.findIndex(u => u.id === parseInt(id));
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        this.users.splice(userIndex, 1);
        return { success: true };
    }

    /**
     * Verifica se usuário é admin
     */
    isAdmin(user) {
        return user && user.role === 'admin';
    }
}

module.exports = LocalAuthService;