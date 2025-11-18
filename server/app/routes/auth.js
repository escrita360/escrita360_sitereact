const express = require('express');
const router = express.Router();
const LocalAuthService = require('../services/local_auth_service');

// Instância do serviço de autenticação local
const authService = new LocalAuthService();

// Middleware para verificar token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Tentando login para:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await authService.login(email, password);
    
    console.log('✅ Login bem-sucedido para:', email);
    res.json(result);

  } catch (error) {
    console.error('❌ Erro ao fazer login:', error.message);
    res.status(401).json({ error: error.message });
  }
});

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    console.log('📝 Tentando registrar usuário:', { email, name, role });

    // Validações básicas
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const newUser = await authService.createUser({ email, password, name, role });
    
    console.log('✅ Usuário registrado com sucesso:', newUser);
    res.status(201).json({ user: newUser });

  } catch (error) {
    console.error('❌ Erro ao registrar usuário:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Verificar token
router.get('/verify', authenticateToken, (req, res) => {
  console.log('🔍 Token verificado para usuário:', req.user.email);
  res.json({ user: req.user });
});

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = authService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('❌ Erro ao obter perfil:', error.message);
    res.status(404).json({ error: error.message });
  }
});

// Atualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await authService.updateUser(req.user.id, { name, email });
    
    console.log('✅ Perfil atualizado para:', updatedUser.email);
    res.json(updatedUser);

  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Alterar senha
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    // Primeiro verificar se a senha atual está correta
    await authService.login(req.user.email, currentPassword);
    
    // Se chegou até aqui, a senha atual está correta
    await authService.updateUser(req.user.id, { password: newPassword });

    console.log('✅ Senha alterada para usuário:', req.user.email);
    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Listar usuários (apenas para admin)
router.get('/users', authenticateToken, (req, res) => {
  try {
    if (!authService.isAdmin(req.user)) {
      return res.status(403).json({ error: 'Acesso negado. Privilégios de administrador necessários.' });
    }

    const users = authService.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Criar usuário admin (endpoint protegido)
router.post('/admin/create', authenticateToken, async (req, res) => {
  try {
    if (!authService.isAdmin(req.user)) {
      return res.status(403).json({ error: 'Acesso negado. Privilégios de administrador necessários.' });
    }

    const { email, password, name } = req.body;
    const newAdmin = await authService.createUser({ 
      email, 
      password, 
      name, 
      role: 'admin' 
    });
    
    console.log('✅ Admin criado com sucesso:', newAdmin);
    res.status(201).json({ user: newAdmin });

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;