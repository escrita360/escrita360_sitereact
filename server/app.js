const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
// Tenta carregar do diretório server primeiro, depois do parent
const envPath = path.join(__dirname, '.env');
const envParentPath = path.join(__dirname, '..', '.env');
const fs = require('fs');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Loaded .env from server directory');
} else if (fs.existsSync(envParentPath)) {
    dotenv.config({ path: envParentPath });
    console.log('✅ Loaded .env from parent directory');
} else {
    console.warn('⚠️  No .env file found, using environment variables');
    dotenv.config(); // Tenta carregar do diretório atual
}

function createApp() {
    const app = express();

    // Configurações
    app.set('secretKey', process.env.SECRET_KEY || 'dev_secret_key');

    // Middleware
    app.use(express.json());
    app.use(cors({ 
        origin: [
            'http://localhost:5173', 
            'http://localhost:3000',
            'http://localhost:5000',
            'http://localhost:8080',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5000',
            'http://127.0.0.1:8080',
            'https://escrita360-react.nnjeij.easypanel.host',
            /\.easypanel\.host$/,
            /\.vercel\.app$/,
            /\.netlify\.app$/
        ],
        credentials: true
    }));

    // Registrar rotas da API
    const paymentRoutes = require('./app/routes/payment');
    const authRoutes = require('./app/routes/auth');
    const adminRoutes = require('./app/routes/admin');
    const webhookRoutes = require('./app/routes/webhook');
    const connectRoutes = require('./app/routes/connect');
    const certificateRoutes = require('./app/routes/certificate');
    const customersRoutes = require('./app/routes/customers');
    const pagbankLogger = require('./app/services/pagbank_logger_service');
    
    app.use('/api/payment', paymentRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/webhook', webhookRoutes);
    app.use('/api/connect', connectRoutes);
    app.use('/api/certificate', certificateRoutes);
    app.use('/api/customers', customersRoutes);

    // Rota para visualizar logs do PagBank
    app.get('/api/logs/pagbank', (req, res) => {
        try {
            const logs = pagbankLogger.getAllLogs();
            res.json(logs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Rota para obter logs em formato Markdown
    app.get('/api/logs/pagbank/markdown', (req, res) => {
        try {
            const markdown = pagbankLogger.getLogsForMarkdown();
            res.type('text/markdown').send(markdown);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

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
    
    try {
        const server = app.listen(port, () => {
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
                process.exit(1);
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
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

module.exports = app;