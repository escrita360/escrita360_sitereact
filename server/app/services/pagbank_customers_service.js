/**
 * Serviço de Clientes PagBank
 * 
 * API Reference: https://developer.pagbank.com.br/reference/customers
 * 
 * Endpoints:
 * - POST /customers - Criar cliente
 * - GET /customers/:id - Consultar cliente
 * - PUT /customers/:id - Atualizar cliente (não documentado oficialmente)
 * - DELETE /customers/:id - Deletar cliente (não disponível)
 */

const axios = require('axios');

class PagBankCustomersService {
    constructor() {
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        this.token = process.env.PAGBANK_TOKEN;
        
        this.baseUrls = {
            sandbox: 'https://sandbox.api.pagseguro.com',
            production: 'https://api.pagseguro.com'
        };
        
        this.baseUrl = this.baseUrls[this.environment];
    }

    /**
     * Verifica se o serviço está configurado
     */
    isConfigured() {
        const configured = !!(this.token && this.baseUrl);
        if (!configured) {
            console.error('⚠️ PagBank Customers Service não configurado:');
            console.error('   - Token:', this.token ? '✓' : '✗');
            console.error('   - Environment:', this.environment);
        }
        return configured;
    }

    /**
     * Obtém informações do ambiente
     */
    getEnvironmentInfo() {
        return {
            environment: this.environment,
            baseUrl: this.baseUrl,
            tokenConfigured: !!this.token,
            service: 'PagBank Customers API'
        };
    }

    /**
     * Faz requisição autenticada para a API de Clientes
     */
    async makeRequest(endpoint, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('PagBank Customers Service não configurado corretamente');
        }

        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            }
        };

        try {
            console.log(`🔗 [${options.method || 'GET'}] ${url}`);
            const response = await axios(url, config);
            console.log('✅ Resposta recebida:', response.status);
            return response.data;
        } catch (error) {
            console.error('❌ Erro na requisição:', error.response?.data || error.message);
            throw this.handleError(error);
        }
    }

    /**
     * Trata erros da API
     */
    handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            return new Error(
                `PagBank API Error ${status}: ${data.message || data.error_description || JSON.stringify(data)}`
            );
        }
        return error;
    }

    /**
     * Valida dados do cliente
     */
    validateCustomerData(customerData) {
        const errors = [];

        // Nome obrigatório
        if (!customerData.name || customerData.name.trim().length < 3) {
            errors.push('Nome é obrigatório (mínimo 3 caracteres)');
        }

        // Email obrigatório e válido
        if (!customerData.email) {
            errors.push('Email é obrigatório');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
            errors.push('Email inválido');
        }

        // CPF/CNPJ obrigatório
        if (!customerData.tax_id) {
            errors.push('CPF/CNPJ (tax_id) é obrigatório');
        } else {
            const taxIdClean = customerData.tax_id.replace(/\D/g, '');
            if (taxIdClean.length !== 11 && taxIdClean.length !== 14) {
                errors.push('CPF deve ter 11 dígitos ou CNPJ 14 dígitos');
            }
        }

        // Telefone (se fornecido)
        if (customerData.phones && customerData.phones.length > 0) {
            customerData.phones.forEach((phone, index) => {
                if (!phone.country || phone.country.length < 1) {
                    errors.push(`Telefone ${index + 1}: country é obrigatório`);
                }
                if (!phone.area || phone.area.length < 2) {
                    errors.push(`Telefone ${index + 1}: area é obrigatório (2 dígitos)`);
                }
                if (!phone.number || phone.number.length < 8) {
                    errors.push(`Telefone ${index + 1}: number é obrigatório (8-9 dígitos)`);
                }
            });
        }

        return errors;
    }

    /**
     * Formata CPF/CNPJ (remove formatação)
     */
    formatTaxId(taxId) {
        return taxId.replace(/\D/g, '');
    }

    /**
     * Formata telefone para o padrão PagBank
     */
    formatPhone(phone) {
        // Se já está formatado
        if (typeof phone === 'object' && phone.country && phone.area && phone.number) {
            return phone;
        }

        // Se é string, formatar
        if (typeof phone === 'string') {
            const cleaned = phone.replace(/\D/g, '');
            
            // Formato: +55 11 999999999
            if (cleaned.startsWith('55')) {
                return {
                    country: '55',
                    area: cleaned.substring(2, 4),
                    number: cleaned.substring(4),
                    type: 'MOBILE'
                };
            }
            
            // Formato: 11999999999
            return {
                country: '55',
                area: cleaned.substring(0, 2),
                number: cleaned.substring(2),
                type: 'MOBILE'
            };
        }

        throw new Error('Formato de telefone inválido');
    }

    /**
     * Cria um novo cliente
     * 
     * @param {Object} customerData - Dados do cliente
     * @param {string} customerData.name - Nome completo
     * @param {string} customerData.email - Email
     * @param {string} customerData.tax_id - CPF ou CNPJ (apenas números)
     * @param {Array} [customerData.phones] - Lista de telefones
     * @param {Object} [customerData.billing_info] - Informações de cobrança
     * @returns {Promise<Object>} Cliente criado
     * 
     * @example
     * const customer = await service.createCustomer({
     *   name: 'João Silva',
     *   email: 'joao.silva@example.com',
     *   tax_id: '12345678901',
     *   phones: [{
     *     country: '55',
     *     area: '11',
     *     number: '987654321',
     *     type: 'MOBILE'
     *   }]
     * });
     */
    async createCustomer(customerData) {
        console.log('🆕 Criando cliente PagBank...');

        // Validar dados
        const validationErrors = this.validateCustomerData(customerData);
        if (validationErrors.length > 0) {
            throw new Error(`Validação falhou:\n- ${validationErrors.join('\n- ')}`);
        }

        // Preparar payload
        const payload = {
            name: customerData.name.trim(),
            email: customerData.email.trim().toLowerCase(),
            tax_id: this.formatTaxId(customerData.tax_id)
        };

        // Adicionar telefones (se fornecido)
        if (customerData.phones && customerData.phones.length > 0) {
            payload.phones = customerData.phones.map(phone => this.formatPhone(phone));
        }

        // Adicionar billing_info (se fornecido)
        if (customerData.billing_info) {
            payload.billing_info = [];
            
            // Endereço de cobrança
            if (customerData.billing_info.address) {
                payload.billing_info.push({
                    type: 'BILLING',
                    street: customerData.billing_info.address.street,
                    number: customerData.billing_info.address.number,
                    complement: customerData.billing_info.address.complement,
                    locality: customerData.billing_info.address.locality,
                    city: customerData.billing_info.address.city,
                    region_code: customerData.billing_info.address.region_code,
                    country: customerData.billing_info.address.country || 'BRA',
                    postal_code: this.formatTaxId(customerData.billing_info.address.postal_code)
                });
            }
        }

        try {
            const response = await this.makeRequest('/customers', {
                method: 'POST',
                data: payload
            });

            console.log('✅ Cliente criado:', response.id);
            return response;
        } catch (error) {
            console.error('❌ Erro ao criar cliente:', error.message);
            throw error;
        }
    }

    /**
     * Consulta cliente por ID
     * 
     * @param {string} customerId - ID do cliente
     * @returns {Promise<Object>} Dados do cliente
     */
    async getCustomer(customerId) {
        console.log(`🔍 Consultando cliente ${customerId}...`);

        if (!customerId) {
            throw new Error('ID do cliente é obrigatório');
        }

        try {
            const response = await this.makeRequest(`/customers/${customerId}`, {
                method: 'GET'
            });

            console.log('✅ Cliente encontrado:', response.id);
            return response;
        } catch (error) {
            console.error('❌ Erro ao consultar cliente:', error.message);
            throw error;
        }
    }

    /**
     * Atualiza dados do cliente
     * NOTA: Esta API não está documentada oficialmente no PagBank.
     * Pode não funcionar. Use por sua conta e risco.
     * 
     * @param {string} customerId - ID do cliente
     * @param {Object} updateData - Dados para atualizar
     * @returns {Promise<Object>} Cliente atualizado
     */
    async updateCustomer(customerId, updateData) {
        console.log(`✏️ Atualizando cliente ${customerId}...`);
        console.warn('⚠️ ATENÇÃO: Endpoint não documentado oficialmente. Pode não funcionar.');

        if (!customerId) {
            throw new Error('ID do cliente é obrigatório');
        }

        // Preparar payload (apenas campos que podem ser atualizados)
        const payload = {};
        
        if (updateData.name) payload.name = updateData.name.trim();
        if (updateData.email) payload.email = updateData.email.trim().toLowerCase();
        if (updateData.phones) {
            payload.phones = updateData.phones.map(phone => this.formatPhone(phone));
        }
        if (updateData.billing_info) {
            payload.billing_info = updateData.billing_info;
        }

        try {
            const response = await this.makeRequest(`/customers/${customerId}`, {
                method: 'PUT',
                data: payload
            });

            console.log('✅ Cliente atualizado:', response.id);
            return response;
        } catch (error) {
            console.error('❌ Erro ao atualizar cliente:', error.message);
            throw error;
        }
    }

    /**
     * Lista clientes (se disponível)
     * NOTA: Esta API não está documentada no PagBank.
     * Retorna erro se não disponível.
     */
    async listCustomers(params = {}) {
        console.log('📋 Listando clientes...');
        console.warn('⚠️ ATENÇÃO: Endpoint não documentado oficialmente.');

        try {
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = `/customers${queryParams ? `?${queryParams}` : ''}`;
            
            const response = await this.makeRequest(endpoint, {
                method: 'GET'
            });

            console.log('✅ Clientes listados:', response.length || 0);
            return response;
        } catch (error) {
            console.error('❌ Erro ao listar clientes:', error.message);
            throw error;
        }
    }
}

module.exports = PagBankCustomersService;
