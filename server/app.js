const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

function createApp() {
    const app = express();

    // Configurações
    app.set('secretKey', process.env.SECRET_KEY || 'dev_secret_key');

    // Middleware
    app.use(express.json());
    app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));

    // Registrar rotas da API
    const paymentRoutes = require('./app/routes/payment');
    const authRoutes = require('./app/routes/auth');
    app.use('/api/payment', paymentRoutes);
    app.use('/api/auth', authRoutes);

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', service: 'escrita360-backend' });
    });

    // Servir arquivos estáticos da distribuição do site
    const distPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(distPath));

    // SPA fallback - todas as rotas não-API retornam o index.html
    app.get('*', (req, res) => {
        // Não interceptar rotas da API
        if (req.path.startsWith('/api/') || req.path === '/health') {
            return res.status(404).json({ error: 'Not found' });
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });

    return app;
}

// Instância da aplicação
const app = createApp();

if (require.main === module) {
    const port = process.env.PORT || 5000;
    console.log(`🔍 Attempting to start server on port ${port}...`);
    
    const server = app.listen(port, 'localhost', () => {
        const address = server.address();
        console.log(`✅ Server running on http://localhost:${address.port}`);
        console.log(`✅ Health check: http://localhost:${address.port}/health`);
        console.log(`✅ API ready: http://localhost:${address.port}/api/payment`);
    });

    server.on('listening', () => {
        console.log(`🎧 Server is now listening...`);
    });

    server.on('error', (error) => {
        console.error('❌ Server error occurred:', error.code, error.message);
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${port} is already in use`);
            process.exit(1);
        } else {
            console.error('❌ Server error:', error);
        }
    });

    // Keep process running
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
}

module.exports = app;