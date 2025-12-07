// src/stores/appStore.js

import { defineStore } from 'pinia';
// Importamos os mocks que você passou, que já estão em JS
import { 
    mockProducts, 
    mockWaiters, 
    mockPricingRules, 
    mockOrders,
    chefCredentials 
} from '@/data/mockData';

// Funções de Ajuda (Simulando os tipos complexos)
const generateId = (prefix) => `${prefix}${Date.now()}`;

export const useAppStore = defineStore('app', {
    
    // --- 1. STATE (Estado Global) ---
    state: () => ({
        // Auth
        currentUser: null, // { type: 'chef' | 'waiter', data: Waiter | ChefCredentials } | null
        
        // Data
        products: JSON.parse(JSON.stringify(mockProducts)), // Usar deep copy para modificações
        waiters: JSON.parse(JSON.stringify(mockWaiters)),
        pricingRules: JSON.parse(JSON.stringify(mockPricingRules)).map(rule => ({
            ...rule,
            currentSales: 0 // Inicializa o contador de vendas para cada regra
        })),
        orders: JSON.parse(JSON.stringify(mockOrders)),
    }),

    // --- 2. GETTERS (Propriedades Computadas) ---
    getters: {
        getProductsByCategory: (state) => (category) => {
            return state.products.filter(p => p.category === category);
        },
        
        // Necessário para o login funcionar corretamente com dados mockados
        // ATENÇÃO: Se você moveu 'password' dos mocks por segurança, remova esta lógica.
        getWaiterByEmail: (state) => (email) => {
            return state.waiters.find(w => w.email === email);
        }
    },

    // --- 3. ACTIONS (Métodos para Mutar o Estado e Lógica) ---
    actions: {
        // --- AUTH ---
        login(email, password) {
            // Checar credenciais do chef
            if (email === chefCredentials.email && password === chefCredentials.password) {
                this.currentUser = { type: 'chef', data: chefCredentials };
                return { success: true, userType: 'chef' };
            }
            
            // Checar credenciais do garçom
            const waiter = this.waiters.find(w => w.email === email);
            if (waiter && waiter.password === password) { // Assumindo 'password' existe no mockWaiters
                if (!waiter.active) {
                    return { success: false, error: 'Conta desativada. Contate o administrador.' };
                }
                this.currentUser = { type: 'waiter', data: waiter };
                return { success: true, userType: 'waiter' };
            }
            
            return { success: false, error: 'Email ou senha inválidos' };
        },
        
        logout() {
            this.currentUser = null;
        },

        // --- PRODUCTS ---
        addProduct(product) {
            this.products.push({ ...product, id: generateId('p') });
        },
        
        updateProduct(id, product) {
            this.products = this.products.map(p => p.id === id ? { ...p, ...product } : p);
        },
        
        deleteProduct(id) {
            this.products = this.products.filter(p => p.id !== id);
        },

        // --- WAITERS ---
        addWaiter(waiter) {
            this.waiters.push({ ...waiter, id: generateId('w') });
        },
        
        updateWaiter(id, waiter) {
            this.waiters = this.waiters.map(w => w.id === id ? { ...w, ...waiter } : w);
        },
        
        deleteWaiter(id) {
            this.waiters = this.waiters.filter(w => w.id !== id);
        },

        // --- PRICING RULES ---
        addPricingRule(rule) {
             // Garante que novas regras tenham o contador de vendas em 0
            this.pricingRules.push({ ...rule, id: generateId('pr'), currentSales: 0 });
        },
        
        updatePricingRule(id, rule) {
            this.pricingRules = this.pricingRules.map(r => r.id === id ? { ...r, ...rule } : r);
        },
        
        deletePricingRule(id) {
            this.pricingRules = this.pricingRules.filter(r => r.id !== id);
        },

        // --- LÓGICA DO PREÇO DINÂMICO ---
        incrementSales(productId, quantity) {
            this.pricingRules = this.pricingRules.map(rule => {
                if (rule.productId === productId) {
                    return { ...rule, currentSales: rule.currentSales + quantity };
                }
                return rule;
            });
        },
        
        applyPricingRules() {
            this.products = this.products.map(product => {
                const rule = this.pricingRules.find(r => r.productId === product.id && r.isActive);
                
                if (rule && rule.currentSales >= rule.salesThreshold) {
                    // Calcula quantas vezes o limite foi atingido
                    const timesThresholdMet = Math.floor(rule.currentSales / rule.salesThreshold);
                    
                    // BasePrice é necessário. Se não existir, usa o preço atual como base.
                    const basePrice = product.originalPrice || product.price; 

                    // Calcula o novo preço com aumento acumulado
                    const increaseFactor = 1 + (rule.percentageIncrease / 100) * timesThresholdMet;
                    const newPrice = basePrice * increaseFactor;
                    
                    // Retorna o novo produto com preço arredondado
                    return { ...product, price: Math.round(newPrice * 100) / 100 };
                }

                // Se a regra não se aplica, o preço deve voltar ao originalPrice (se houver)
                if (product.originalPrice && product.price !== product.originalPrice) {
                    return { ...product, price: product.originalPrice };
                }
                
                return product;
            });
        },

        // --- ORDERS ---
        addOrder(order) {
            // 1. Processa a lógica de venda (incrementa e aplica preço)
            order.items.forEach(item => {
                this.incrementSales(item.productId, item.quantity);
            });
            this.applyPricingRules();

            // 2. Adiciona o pedido
            this.orders.push({ 
                ...order, 
                id: generateId('o'), 
                createdAt: new Date().toISOString() 
            });
        },
        
        updateOrderStatus(id, status) {
            this.orders = this.orders.map(o => o.id === id ? { ...o, status } : o);
        }
    }
});