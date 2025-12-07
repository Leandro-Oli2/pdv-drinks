<template>
  <div class="min-h-screen bg-background">
    
    <header class="glass sticky top-0 z-50 border-b border-border">
      <div class="container mx-auto px-4 py-3 lg:py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
            <ChefHat class="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 class="text-lg lg:text-xl font-display font-bold text-foreground">Painel do Chef</h1>
            <p class="text-xs text-muted-foreground hidden sm:block">Gerenciamento do Bar</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" @click="navigate('/')">
          <LogOut class="w-5 h-5" />
        </Button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 lg:py-8">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="glass rounded-xl p-4 lg:p-6 animate-slide-up"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
              <p class="text-2xl lg:text-3xl font-display font-bold text-foreground mt-1">{{ stat.value }}</p>
            </div>
            <div :class="`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-secondary flex items-center justify-center`">
              <component :is="stat.icon" :class="['w-5 h-5 lg:w-6 lg:h-6', stat.color]" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          :variant="activeTab === 'products' ? 'default' : 'secondary'"
          @click="setActiveTab('products')"
          class="flex items-center gap-2 flex-shrink-0"
        >
          <UtensilsCrossed class="w-4 h-4" />
          Produtos
        </Button>
        <Button
          :variant="activeTab === 'waiters' ? 'default' : 'secondary'"
          @click="setActiveTab('waiters')"
          class="flex items-center gap-2 flex-shrink-0"
        >
          <Users class="w-4 h-4" />
          Garçons
        </Button>
        <Button
          :variant="activeTab === 'pricing' ? 'default' : 'secondary'"
          @click="setActiveTab('pricing')"
          class="flex items-center gap-2 flex-shrink-0"
        >
          <TrendingUp class="w-4 h-4" />
          Preço Dinâmico
        </Button>
      </div>

      <div v-if="activeTab === 'products'" class="space-y-6 animate-fade-in">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div class="flex gap-2 flex-wrap">
            <Button
              v-for="cat in ['all', 'drinks', 'food', 'portions']"
              :key="cat"
              :variant="categoryFilter === cat ? 'outline' : 'ghost'"
              size="sm"
              @click="setCategoryFilter(cat as typeof categoryFilter.value)"
              :class="categoryFilter === cat ? 'border-primary text-primary' : ''"
            >
              {{ cat === 'all' ? 'Todos' : getCategoryLabel(cat) }}
            </Button>
          </div>
          <Button variant="premium" class="flex items-center gap-2 flex-shrink-0">
            <Plus class="w-4 h-4" />
            Novo Produto
          </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            class="glass rounded-xl overflow-hidden animate-scale-in"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="aspect-video relative overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-3 right-3">
                <span :class="`px-3 py-1 rounded-full text-xs font-medium ${
                  product.available ? 'bg-black/80 text-success' : 'bg-black/80 text-destructive'
                }`">
                  {{ product.available ? 'Disponível' : 'Indisponível' }}
                </span>
              </div>
              <div class="absolute top-3 left-3">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {{ getCategoryLabel(product.category) }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-display font-semibold text-foreground">{{ product.name }}</h3>
              <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ product.description }}</p>
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center gap-2">
                  <span class="text-xl font-bold text-primary">
                    R$ {{ product.price.toFixed(2) }}
                  </span>
                  <span v-if="product.price !== product.originalPrice" class="text-sm text-muted-foreground line-through">
                    R$ {{ product.originalPrice.toFixed(2) }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit2 class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive">
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div v-if="product.category === 'drinks'" class="mt-3 pt-3 border-t border-border">
                <p class="text-xs text-muted-foreground">
                  Vendidos: <span class="text-foreground font-medium">{{ product.salesCount }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'waiters'" class="space-y-6 animate-fade-in">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-display font-semibold text-foreground">Equipe de Garçons</h2>
          <Button variant="premium" class="flex items-center gap-2">
            <Plus class="w-4 h-4" />
            Novo Garçom
          </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(waiter, index) in waiters"
            :key="waiter.id"
            
            class="bg-dark-card rounded-xl p-6 animate-scale-in" 
            
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span class="text-xl font-display font-bold text-foreground">
                    {{ waiter.name.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="font-display font-semibold text-foreground">{{ waiter.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ waiter.email }}</p>
                  <p class="text-sm text-muted-foreground">{{ waiter.phone }}</p>
                </div>
              </div>
              <span :class="`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                waiter.active ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
              }`">
                {{ waiter.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
            <div class="flex gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="secondary" size="sm" class="flex-1">
                <Edit2 class="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive">
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'pricing'" class="space-y-6 animate-fade-in">
        <div class="glass rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 class="text-xl font-display font-semibold text-foreground">Preço Dinâmico</h2>
              <p class="text-muted-foreground mt-1">
                Configure regras automáticas de aumento de preço para drinks baseado nas vendas.
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center flex-wrap gap-2">
          <h3 class="text-lg font-display font-semibold text-foreground">Regras Configuradas</h3>
          <Button variant="premium" class="flex items-center gap-2 flex-shrink-0">
            <Plus class="w-4 h-4" />
            Nova Regra
          </Button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(rule, index) in pricingRules"
            :key="rule.id"
            class="glass rounded-xl p-4 lg:p-6 animate-slide-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div v-if="getProduct(rule.productId)">
              <div class="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                
                <div class="flex items-center gap-4 flex-1">
                  <img
                    :src="getProduct(rule.productId).image"
                    :alt="getProduct(rule.productId).name"
                    class="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <h4 class="font-display font-semibold text-foreground">{{ getProduct(rule.productId).name }}</h4>
                    <span class="text-sm text-muted-foreground">
                      Atual: <span class="text-primary font-semibold">R$ {{ getProduct(rule.productId).price.toFixed(2) }}</span>
                    </span>
                  </div>
                </div>

                <div class="flex justify-between lg:justify-start items-center gap-4 lg:gap-6 w-full lg:w-auto mt-2 lg:mt-0">
                  
                  <div class="text-center">
                    <div class="flex items-center gap-1 text-primary">
                      <Percent class="w-4 h-4" />
                      <span class="text-xl font-bold">{{ rule.percentageIncrease }}%</span>
                    </div>
                    <p class="text-xs text-muted-foreground">Aumento</p>
                  </div>

                  <div class="text-center">
                    <div class="flex items-center gap-1 text-foreground">
                      <Wine class="w-4 h-4" />
                      <span class="text-xl font-bold">{{ rule.salesThreshold }}</span>
                    </div>
                    <p class="text-xs text-muted-foreground">Meta</p>
                  </div>

                  <div class="text-center">
                    <span class="text-xl font-bold text-success">{{ timesApplied(rule.productId, rule.salesThreshold) }}x</span>
                    <p class="text-xs text-muted-foreground">Aplicado</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0 mt-2 lg:mt-0">
                  <span :class="`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    rule.isActive ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                  }`">
                    {{ rule.isActive ? 'Ativa' : 'Inativa' }}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Edit2 class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive">
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-border">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-muted-foreground">Progresso para próximo aumento</span>
                  <span class="text-foreground font-medium">
                    {{ getProduct(rule.productId).salesCount % rule.salesThreshold }} / {{ rule.salesThreshold }}
                  </span>
                </div>
                <div class="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    class="h-full gradient-gold transition-all duration-500"
                    :style="{ width: `${progressPercentage(rule.productId, rule.salesThreshold)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass rounded-xl p-6">
          <h3 class="text-lg font-display font-semibold text-foreground mb-4">Adicionar Nova Regra</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="col-span-2 md:col-span-1">
              <label class="text-sm text-muted-foreground mb-2 block">Drink</label>
              <select class="w-full h-11 rounded-lg border border-border bg-input px-4 text-foreground">
                <option value="">Selecione...</option>
                <option v-for="p in drinkProducts" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm text-muted-foreground mb-2 block">% de Aumento</label>
              <Input type="number" placeholder="2" min="1" max="50" />
            </div>
            <div>
              <label class="text-sm text-muted-foreground mb-2 block">Meta de Vendas</label>
              <Input type="number" placeholder="20" min="1" />
            </div>
            <div class="flex items-end col-span-2 md:col-span-1">
              <Button variant="premium" class="w-full">
                <Plus class="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Componentes UI (Ajuste o caminho se necessário)
import Button from '@/components/UI/button.vue'; 
import Input from '@/components/UI/input.vue'; 

// Ícones
import { Wine, UtensilsCrossed, Users, TrendingUp, Plus, Edit2, Trash2, LogOut, Package, ChefHat, Percent } from 'lucide-vue-next'; 

// Mocks e Tipos
import { mockProducts, mockWaiters, mockPricingRules } from '@/data/mockData';
import type { Product, Waiter, PricingRule } from '@/data/mockData';

// --- Variáveis de Estado ---
type Tab = 'products' | 'waiters' | 'pricing';
type CategoryFilter = 'all' | 'drinks' | 'food' | 'portions';

const router = useRouter();
const activeTab = ref<Tab>('products');
// NOTE: Em uma aplicação real, estes seriam substituídos por estados Pinia
const products = ref<Product[]>(mockProducts);
const waiters = ref<Waiter[]>(mockWaiters);
const pricingRules = ref<PricingRule[]>(mockPricingRules);
const categoryFilter = ref<CategoryFilter>('all');

// --- Computed Properties e Funções ---

const filteredProducts = computed(() => {
  if (categoryFilter.value === 'all') return products.value;
  return products.value.filter(p => p.category === categoryFilter.value);
});

const drinkProducts = computed(() => products.value.filter(p => p.category === 'drinks'));

const stats = computed(() => [
  { label: 'Total Produtos', value: products.value.length, icon: Package, color: 'text-primary' },
  { label: 'Garçons Ativos', value: waiters.value.filter(w => w.active).length, icon: Users, color: 'text-success' }, 
  { label: 'Regras de Preço', value: pricingRules.value.filter(r => r.isActive).length, icon: TrendingUp, color: 'text-primary' },
]);

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'drinks': return 'Drinks';
    case 'food': return 'Pratos';
    case 'portions': return 'Porções';
    default: return category;
  }
};

const navigate = (path: string) => {
  router.push(path);
};

const setActiveTab = (tab: Tab) => {
  activeTab.value = tab;
};

const setCategoryFilter = (cat: CategoryFilter) => {
  categoryFilter.value = cat;
};

const getProduct = (productId: string) => {
  return products.value.find(p => p.id === productId);
};

const timesApplied = (productId: string, salesThreshold: number) => {
  const product = getProduct(productId);
  if (!product) return 0;
  return Math.floor(product.salesCount / salesThreshold);
};

const progressPercentage = (productId: string, salesThreshold: number) => {
  const product = getProduct(productId);
  if (!product) return 0;
  const progress = (product.salesCount % salesThreshold) / salesThreshold * 100;
  return Math.min(progress, 100) || 0;
};
</script>

<style scoped>
/* Estilos para o Glassmorphism e gradiente */
.glass {
  background-color: rgba(255, 255, 255, 0.08); 
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Dourado/Amarelo Queimado (Revisado para um tom mais Âmbar/Ouro) */
.gradient-gold {
  /* Substituindo o tom anterior (mais laranja) por um âmbar/ouro mais profundo */
  background-image: linear-gradient(to right top, #b45309, #d97706, #fbbf24); 
}
</style>