/**
 * src/data/mockData.js
 *
 * Este arquivo contém as definições de dados mockados para o Front-end,
 * incluindo credenciais de autenticação necessárias para a Store Pinia.
 */

// --- 1. Credenciais de Autenticação (Adicionado) ---
export const chefCredentials = {
    email: 'chef1@bar.com',
    password: '456', // Senha para login do chef
    name: 'Administrador Chef'
};

// --- 2. Mock Data Principal ---

export const mockProducts = [
    {
        id: '1',
        name: 'Caipirinha Tradicional',
        description: 'Cachaça artesanal, limão, açúcar e gelo',
        price: 18.00,
        originalPrice: 18.00,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
        available: true,
        salesCount: 15,
    },
    {
        id: '2',
        name: 'Mojito',
        description: 'Rum, hortelã fresca, limão, açúcar e água com gás',
        price: 22.00,
        originalPrice: 22.00,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
        available: true,
        salesCount: 8,
    },
    {
        id: '3',
        name: 'Gin Tônica Premium',
        description: 'Gin importado, tônica artesanal e especiarias',
        price: 28.00,
        originalPrice: 28.00,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=400',
        available: true,
        salesCount: 22,
    },
    {
        id: '4',
        name: 'Whisky Sour',
        description: 'Whisky bourbon, suco de limão, xarope e clara de ovo',
        price: 32.00,
        originalPrice: 32.00,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400',
        available: true,
        salesCount: 5,
    },
    {
        id: '5',
        name: 'Margarita',
        description: 'Tequila, Cointreau, suco de limão e sal na borda',
        price: 26.00,
        originalPrice: 26.00,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?w=400',
        available: true,
        salesCount: 12,
    },
    {
        id: '6',
        name: 'Picanha na Brasa',
        description: 'Picanha grelhada, arroz, farofa e vinagrete',
        price: 65.00,
        originalPrice: 65.00,
        category: 'food',
        image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400',
        available: true,
        salesCount: 18,
    },
    {
        id: '7',
        name: 'Filé com Fritas',
        description: 'Filé mignon grelhado com batatas fritas crocantes',
        price: 55.00,
        originalPrice: 55.00,
        category: 'food',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
        available: true,
        salesCount: 25,
    },
    {
        id: '8',
        name: 'Hambúrguer Artesanal',
        description: 'Blend da casa, queijo cheddar, bacon e molho especial',
        price: 42.00,
        originalPrice: 42.00,
        category: 'food',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        available: true,
        salesCount: 32,
    },
    {
        id: '9',
        name: 'Batata Frita',
        description: 'Porção de batatas fritas crocantes com molho especial',
        price: 28.00,
        originalPrice: 28.00,
        category: 'portions',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        available: true,
        salesCount: 45,
    },
    {
        id: '10',
        name: 'Onion Rings',
        description: 'Anéis de cebola empanados e fritos',
        price: 32.00,
        originalPrice: 32.00,
        category: 'portions',
        image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
        available: true,
        salesCount: 20,
    },
    {
        id: '11',
        name: 'Nachos com Guacamole',
        description: 'Nachos crocantes com guacamole fresco e queijo',
        price: 38.00,
        originalPrice: 38.00,
        category: 'portions',
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
        available: true,
        salesCount: 15,
    },
    {
        id: '12',
        name: 'Tábua de Frios',
        description: 'Seleção de queijos, presunto, salame e azeitonas',
        price: 58.00,
        originalPrice: 58.00,
        category: 'portions',
        image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400',
        available: true,
        salesCount: 10,
    },
];

export const mockPricingRules = [
    {
        id: '1',
        productId: '1',
        percentageIncrease: 2,
        salesThreshold: 20,
        isActive: true,
    },
    {
        id: '2',
        productId: '3',
        percentageIncrease: 3,
        salesThreshold: 25,
        isActive: true,
    },
];

export const mockWaiters = [
    {
        id: '1',
        name: 'João Silva',
        email: 'garcom1', // Login usado no Front-end (sem @bar.com para simplificar)
        password: '123', // <<-- Adicionado para a Store
        phone: '(11) 99999-0001',
        active: true,
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@bar.com',
        password: '456', // Senha mockada
        phone: '(11) 99999-0002',
        active: true,
        createdAt: '2024-02-20',
    },
    {
        id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro@bar.com',
        password: '789', // Senha mockada
        phone: '(11) 99999-0003',
        active: false,
        createdAt: '2024-03-10',
    },
];

export const mockOrders = [
    {
        id: '1',
        tableNumber: 5,
        waiterId: '1',
        items: [
            { id: '1', productId: '1', productName: 'Caipirinha Tradicional', quantity: 2, unitPrice: 18.00, total: 36.00 },
            { id: '2', productId: '9', productName: 'Batata Frita', quantity: 1, unitPrice: 28.00, total: 28.00 },
        ],
        status: 'open',
        createdAt: new Date().toISOString(),
        total: 64.00,
    },
    {
        id: '2',
        tableNumber: 12,
        waiterId: '2',
        items: [
            { id: '3', productId: '3', productName: 'Gin Tônica Premium', quantity: 3, unitPrice: 28.00, total: 84.00 },
            { id: '4', productId: '6', productName: 'Picanha na Brasa', quantity: 2, unitPrice: 65.00, total: 130.00 },
        ],
        status: 'open',
        createdAt: new Date().toISOString(),
        total: 214.00,
    },
];