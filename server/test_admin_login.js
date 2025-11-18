const LocalAuthService = require('./app/services/local_auth_service');

async function testAdminLogin() {
    console.log('🧪 Testando sistema de autenticação local...');
    
    const authService = new LocalAuthService();
    
    try {
        // Tentar fazer login como admin
        const result = await authService.login('admin@escrita360.com', 'admin123');
        
        console.log('✅ Login admin bem-sucedido!');
        console.log('📄 Dados:', {
            email: result.user.email,
            name: result.user.name,
            role: result.user.role
        });
        console.log('🔑 Token:', result.token.substring(0, 50) + '...');
        
        // Verificar se é admin
        const isAdmin = authService.isAdmin(result.user);
        console.log('👑 É admin?', isAdmin);
        
        return result;
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

// Executar teste se chamado diretamente
if (require.main === module) {
    testAdminLogin();
}

module.exports = testAdminLogin;