const LocalAuthService = require('../services/local_auth_service');

// Instância do serviço de autenticação
const authService = new LocalAuthService();

/**
 * Middleware para verificar token JWT
 */
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
    return res.status(403).json({ error: 'Token inválido' });
  }
};

/**
 * Middleware para verificar se usuário é admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (!authService.isAdmin(req.user)) {
    return res.status(403).json({ error: 'Acesso negado. Privilégios de administrador necessários.' });
  }

  next();
};

/**
 * Middleware combinado: autentica e verifica admin
 */
const adminAuth = [authenticateToken, requireAdmin];

module.exports = {
  authenticateToken,
  requireAdmin,
  adminAuth
};
