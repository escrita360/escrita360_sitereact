const jwt = require('jsonwebtoken');

// Lista de emails de administradores - em produção, use banco de dados
const ADMIN_EMAILS = [
  'admin@escrita360.com',
  'suporte@escrita360.com'
];

/**
 * Middleware para verificar token JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY || 'jwt_secret_dev_12345', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

/**
 * Middleware para verificar se usuário é admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (!ADMIN_EMAILS.includes(req.user.email)) {
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
  adminAuth,
  ADMIN_EMAILS
};
