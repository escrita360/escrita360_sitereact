/**
 * Rotas para gerenciamento de clientes PagBank
 */

const express = require('express');
const router = express.Router();
const PagBankCustomersService = require('../services/pagbank_customers_service');

const customersService = new PagBankCustomersService();

/**
 * GET /api/customers/info
 * Informações do serviço de clientes
 */
router.get('/info', (req, res) => {
    try {
        const info = customersService.getEnvironmentInfo();
        res.json({
            success: true,
            ...info
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/customers
 * Criar novo cliente
 * 
 * Body:
 * {
 *   "name": "João Silva",
 *   "email": "joao.silva@example.com",
 *   "tax_id": "12345678901",
 *   "phones": [
 *     {
 *       "country": "55",
 *       "area": "11",
 *       "number": "987654321",
 *       "type": "MOBILE"
 *     }
 *   ],
 *   "billing_info": {
 *     "address": {
 *       "street": "Rua Exemplo",
 *       "number": "123",
 *       "complement": "Apto 45",
 *       "locality": "Centro",
 *       "city": "São Paulo",
 *       "region_code": "SP",
 *       "postal_code": "01310-100"
 *     }
 *   }
 * }
 */
router.post('/', async (req, res) => {
    try {
        const customerData = req.body;

        if (!customerData.name || !customerData.email || !customerData.tax_id) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: name, email, tax_id'
            });
        }

        const customer = await customersService.createCustomer(customerData);

        res.status(201).json({
            success: true,
            customer: customer
        });
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/customers/:id
 * Consultar cliente por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'ID do cliente é obrigatório'
            });
        }

        const customer = await customersService.getCustomer(id);

        res.json({
            success: true,
            customer: customer
        });
    } catch (error) {
        console.error('Erro ao consultar cliente:', error);
        
        // Se for 404, retornar status apropriado
        if (error.message.includes('404')) {
            return res.status(404).json({
                success: false,
                error: 'Cliente não encontrado'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/customers/:id
 * Atualizar cliente (endpoint não oficial)
 * 
 * Body (todos opcionais):
 * {
 *   "name": "João Silva Atualizado",
 *   "email": "novo.email@example.com",
 *   "phones": [...],
 *   "billing_info": {...}
 * }
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'ID do cliente é obrigatório'
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum dado para atualizar'
            });
        }

        const customer = await customersService.updateCustomer(id, updateData);

        res.json({
            success: true,
            customer: customer,
            warning: 'Endpoint não documentado oficialmente'
        });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/customers
 * Listar clientes (endpoint não oficial)
 * 
 * Query params:
 * - limit: número de resultados
 * - offset: paginação
 */
router.get('/', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        
        const params = {};
        if (limit) params.limit = limit;
        if (offset) params.offset = offset;

        const customers = await customersService.listCustomers(params);

        res.json({
            success: true,
            customers: customers,
            warning: 'Endpoint não documentado oficialmente'
        });
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/customers/validate
 * Valida dados do cliente sem criar
 */
router.post('/validate', (req, res) => {
    try {
        const customerData = req.body;
        const errors = customersService.validateCustomerData(customerData);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                valid: false,
                errors: errors
            });
        }

        res.json({
            success: true,
            valid: true,
            message: 'Dados válidos'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
