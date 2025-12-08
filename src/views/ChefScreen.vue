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
            <div :class="`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${stat.color}`">
              <component :is="stat.icon" class="w-5 h-5 lg:w-6 lg:h-6" />
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
          <Button variant="premium" class="flex items-center gap-2 flex-shrink-0" @click="startCreate">
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
                <span :class="`px-3 py-1 rounded-full text-xs font-medium bg-black/80 ${
                  product.available ? 'text-success' : 'text-destructive'
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
                  <Button variant="ghost" size="icon" @click="startEdit(product)">
                    <Edit2 class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive" @click="deleteItem(product.id, product.name)">
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
          <Button variant="premium" class="flex items-center gap-2" @click="startCreateWaiter">
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
              <Button variant="secondary" size="sm" class="flex-1" @click="startEditWaiter(waiter)">
                <Edit2 class="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive" @click="deleteWaiter(waiter.id, waiter.name)">
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
          <Button variant="premium" class="flex items-center gap-2 flex-shrink-0" @click="startCreateRule">
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
                  <Button variant="ghost" size="icon" @click="startEditRule(rule)">
                    <Edit2 class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive" @click="deleteRule(rule.id, getProduct(rule.productId).name)">
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
              <Button variant="premium" class="w-full" @click="startCreateRule">
                <Plus class="w-4 h-4 mr-2" />
                Adicionar (Abrir Formulário)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Modal v-if="isEditing || isCreating" @close="cancelAction">
        
        <template #title>
            {{ isCreating ? 'Criar Novo Produto' : `Editar Produto: ${selectedProduct?.name}` }}
        </template>

        <form @submit.prevent="saveProduct" class="space-y-4" v-if="selectedProduct">
            
            <div class="space-y-2">
                <label class="text-sm text-muted-foreground block">Nome</label>
                <Input v-model="selectedProduct.name" type="text" required />
            </div>

            <div class="space-y-2" v-if="isCreating">
                <label class="text-sm text-muted-foreground block">Categoria</label>
                <select v-model="selectedProduct.category" class="w-full h-11 rounded-lg border border-border bg-input px-4 text-foreground">
                    <option value="drinks">Drinks</option>
                    <option value="food">Pratos</option>
                    <option value="portions">Porções</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm text-muted-foreground block">Preço Atual (R$)</label>
                    <Input v-model.number="selectedProduct.price" type="number" step="0.01" required />
                </div>
                <div class="space-y-2 flex flex-col justify-end">
                    <label class="text-sm text-muted-foreground block">Status</label>
                    <select v-model="selectedProduct.available" class="w-full h-11 rounded-lg border border-border bg-input px-4 text-foreground">
                        <option :value="true">Disponível</option>
                        <option :value="false">Indisponível</option>
                    </select>
                </div>
            </div>
            
            <div class="space-y-2">
                <label class="text-sm text-muted-foreground block">Descrição</label>
                <textarea v-model="selectedProduct.description" class="w-full h-20 rounded-lg border border-border bg-input p-4 text-foreground resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" @click="cancelAction">
                    Cancelar
                </Button>
                <Button variant="default" type="submit">
                    {{ isCreating ? 'Criar Produto' : 'Salvar Alterações' }}
                </Button>
            </div>
        </form>
    </Modal>
    
    <Modal v-if="isEditingWaiter || isCreatingWaiter" @close="cancelWaiterAction">
        
        <template #title>
            {{ isCreatingWaiter ? 'Cadastrar Novo Garçom' : `Editar Garçom: ${selectedWaiter?.name}` }}
        </template>

        <form @submit.prevent="saveWaiter" class="space-y-4" v-if="selectedWaiter">
            
            <div class="space-y-2">
                <label class="text-sm text-muted-foreground block">Nome Completo</label>
                <Input v-model="selectedWaiter.name" type="text" required />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm text-muted-foreground block">Email (Matrícula)</label>
                    <Input v-model="selectedWaiter.email" type="email" :disabled="isEditingWaiter" required />
                </div>
                <div class="space-y-2">
                    <label class="text-sm text-muted-foreground block">Telefone</label>
                    <Input v-model="selectedWaiter.phone" type="text" placeholder="(99) 99999-9999" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm text-muted-foreground block">
                        {{ isCreatingWaiter ? 'Senha Inicial' : 'Nova Senha (opcional)' }}
                    </label>
                    <Input 
                        v-model="selectedWaiter.password" 
                        type="password" 
                        :required="isCreatingWaiter" 
                        placeholder="********" 
                    />
                    <p v-if="isEditingWaiter" class="text-xs text-muted-foreground">
                        Deixe vazio para manter a senha atual.
                    </p>
                </div>
                <div class="space-y-2 flex flex-col justify-end">
                    <label class="text-sm text-muted-foreground block">Status</label>
                    <select v-model="selectedWaiter.active" class="w-full h-11 rounded-lg border border-border bg-input px-4 text-foreground">
                        <option :value="true">Ativo</option>
                        <option :value="false">Inativo</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" @click="cancelWaiterAction">
                    Cancelar
                </Button>
                <Button variant="default" type="submit">
                    {{ isCreatingWaiter ? 'Cadastrar Garçom' : 'Salvar Alterações' }}
                </Button>
            </div>
        </form>
    </Modal>
    
    <Modal v-if="isEditingRule || isCreatingRule" @close="cancelRuleAction">
        
        <template #title>
            {{ isCreatingRule ? 'Criar Nova Regra' : `Editar Regra: ${getProduct(selectedRule?.productId)?.name}` }}
        </template>

        <form @submit.prevent="saveRule" class="space-y-4" v-if="selectedRule">
            
            <div class="space-y-2">
                <label class="text-sm text-muted-foreground block">Drink Aplicável</label>
                <select v-model="selectedRule.productId" 
                        :disabled="isEditingRule"
                        class="w-full h-11 rounded-lg border border-border bg-input px-4 text-foreground">
                    <option value="" disabled>Selecione um Drink</option>
                    <option v-for="p in drinkProducts" :key="p.id" :value="p.id">
                        {{ p.name }} 
                        <span v-if="getProduct(p.id)?.price !== getProduct(p.id)?.originalPrice"> (Preço Alterado)</span>
                    </option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm text-muted-foreground block">% de Aumento</label>
                    <Input v-model.number="selectedRule.percentageIncrease" type="number" min="1" max="50" required />
                </div>
                <div class="space-y-2">
                    <label class="text-sm text-muted-foreground block">Meta de Vendas (unidades)</label>
                    <Input v-model.number="selectedRule.salesThreshold" type="number" min="1" required />
                </div>
            </div>

            <div class="space-y-2">
                <label class="text-sm text-muted-foreground block">Status da Regra</label>
                <select v-model="selectedRule.isActive" class="w-full h-11 rounded-lg border border-border bg-input px-4 text-foreground">
                    <option :value="true">Ativa (Aplicar aumentos)</option>
                    <option :value="false">Inativa (Ignorar regra)</option>
                </select>
            </div>

            <div class="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" @click="cancelRuleAction">
                    Cancelar
                </Button>
                <Button variant="default" type="submit">
                    {{ isCreatingRule ? 'Criar Regra' : 'Salvar Regra' }}
                </Button>
            </div>
        </form>
    </Modal>

    <Modal v-if="deleteConfirmation" @close="cancelDeletion">
        
        <template #title>
            Confirmar Exclusão
        </template>

        <div class="space-y-6">
            <p class="text-lg text-foreground">
                Você tem certeza que deseja excluir
                <span class="font-bold text-destructive">
                    o(a) {{ deleteConfirmation.type }} "{{ deleteConfirmation.name }}"
                </span>? 
            </p>
            <p class="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita. Todos os dados relacionados serão perdidos.
            </p>
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" @click="cancelDeletion">
                Cancelar
            </Button>
            <Button variant="destructive" type="button" @click="confirmDeletion">
                Excluir Permanentemente
            </Button>
        </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/UI/button.vue'; 
import Input from '@/components/UI/input.vue'; 
import Modal from '@/components/Modal.vue'; 
import { Wine, UtensilsCrossed, Users, TrendingUp, Plus, Edit2, Trash2, LogOut, Package, ChefHat, Percent } from 'lucide-vue-next'; 
import { useAppStore } from '@/stores/drinkStore';
import type { Product, Waiter, PricingRule } from '@/data/mockData';

type Tab = 'products' | 'waiters' | 'pricing';
type CategoryFilter = 'all' | 'drinks' | 'food' | 'portions';

interface DeletionTarget {
    id: string;
    name: string;
    type: 'produto' | 'garçom' | 'regra';
    callback: () => void;
}

const router = useRouter();
const appStore = useAppStore();

const activeTab = ref<Tab>('products');
const categoryFilter = ref<CategoryFilter>('all');

const isEditing = ref(false);
const isCreating = ref(false);
const selectedProduct = ref(null as Product | null); 

const isEditingWaiter = ref(false);
const isCreatingWaiter = ref(false);
const selectedWaiter = ref(null as Waiter | null);

const isEditingRule = ref(false);
const isCreatingRule = ref(false);
const selectedRule = ref(null as PricingRule | null);

const deleteConfirmation = ref(null as DeletionTarget | null);

const products = computed(() => appStore.products || []);
const waiters = computed(() => appStore.waiters || []);
const pricingRules = computed(() => appStore.pricingRules || []);

const filteredProducts = computed(() => {
  if (categoryFilter.value === 'all') return products.value;
  return products.value.filter(p => p.category === categoryFilter.value);
});

const drinkProducts = computed(() => products.value.filter(p => p.category === 'drinks'));

const stats = computed(() => [
  { label: 'Total Produtos', value: products.value.length, icon: Package, color: 'text-primary bg-primary/20' },
  { label: 'Garçons Ativos', value: waiters.value.filter(w => w.active).length, icon: Users, color: 'text-success bg-success/20' }, 
  { label: 'Regras de Preço', value: pricingRules.value.filter(r => r.isActive).length, icon: TrendingUp, color: 'text-primary bg-primary/20' },
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

const newProductBase: Omit<Product, 'id' | 'salesCount'> = { 
  name: '', 
  description: '', 
  price: 0, 
  originalPrice: 0,
  category: 'drinks', 
  image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400', 
  available: true,
};

const startCreate = () => {
  selectedProduct.value = { ...newProductBase, id: 'temp', salesCount: 0 } as Product;
  isCreating.value = true;
};

const startEdit = (product: Product) => {
  selectedProduct.value = { ...product }; 
  isEditing.value = true;
};

const cancelAction = () => {
  isEditing.value = false;
  isCreating.value = false;
  selectedProduct.value = null;
};

const saveProduct = () => {
  if (!selectedProduct.value) return;

  if (isCreating.value) {
    appStore.addProduct(selectedProduct.value);
  } else if (isEditing.value) {
    appStore.updateProduct(selectedProduct.value.id, selectedProduct.value);
  }
  
  cancelAction();
};

const deleteItem = (productId: string, productName: string) => {
    deleteConfirmation.value = {
        id: productId,
        name: productName,
        type: 'produto',
        callback: () => {
            appStore.deleteProduct(productId);
            deleteConfirmation.value = null; 
        }
    };
};

const waiterBase: Omit<Waiter, 'id'> = { 
  name: '', 
  email: '', 
  password: '',
  phone: '', 
  active: true,
};

const startCreateWaiter = () => {
  selectedWaiter.value = { ...waiterBase, id: 'temp', email: '', password: '' } as Waiter;
  isCreatingWaiter.value = true;
};

const startEditWaiter = (waiter: Waiter) => {
  selectedWaiter.value = { ...waiter, password: '' };
  isEditingWaiter.value = true;
};

const cancelWaiterAction = () => {
  isEditingWaiter.value = false;
  isCreatingWaiter.value = false;
  selectedWaiter.value = null;
};

const saveWaiter = () => {
  if (!selectedWaiter.value) return;

  if (isCreatingWaiter.value) {
    appStore.addWaiter(selectedWaiter.value);
  } else if (isEditingWaiter.value) {
    const updatedData = { ...selectedWaiter.value };
    if (!updatedData.password) {
      delete updatedData.password;
    }
    appStore.updateWaiter(selectedWaiter.value.id, updatedData);
  }
  
  cancelWaiterAction();
};

const deleteWaiter = (waiterId: string, waiterName: string) => {
    deleteConfirmation.value = {
        id: waiterId,
        name: waiterName,
        type: 'garçom',
        callback: () => {
            appStore.deleteWaiter(waiterId);
            deleteConfirmation.value = null; 
        }
    };
};

const ruleBase: Omit<PricingRule, 'id'> = { 
    productId: '',
    percentageIncrease: 1, 
    salesThreshold: 10,
    isActive: true,
};

const startCreateRule = () => {
  selectedRule.value = { ...ruleBase, id: 'temp' } as PricingRule;
  isCreatingRule.value = true;
};

const startEditRule = (rule: PricingRule) => {
  selectedRule.value = { ...rule };
  isEditingRule.value = true;
};

const cancelRuleAction = () => {
  isEditingRule.value = false;
  isCreatingRule.value = false;
  selectedRule.value = null;
};

const saveRule = () => {
  if (!selectedRule.value) return;

  if (isCreatingRule.value) {
    appStore.addPricingRule(selectedRule.value);
  } else if (isEditingRule.value) {
    appStore.updatePricingRule(selectedRule.value.id, selectedRule.value);
  }
  
  appStore.applyPricingRules(); 
  cancelRuleAction();
};

const deleteRule = (ruleId: string, productName: string) => {
    deleteConfirmation.value = {
        id: ruleId,
        name: productName,
        type: 'regra',
        callback: () => {
            appStore.deletePricingRule(ruleId);
            appStore.applyPricingRules(); 
            deleteConfirmation.value = null; 
        }
    };
};


const confirmDeletion = () => {
    if (deleteConfirmation.value) {
        deleteConfirmation.value.callback();
    }
};

const cancelDeletion = () => {
    deleteConfirmation.value = null;
};
</script>

<style scoped>
.glass {
  background-color: rgba(255, 255, 255, 0.08); 
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-gold {
  background-image: linear-gradient(to right top, #b45309, #d97706, #fbbf24); 
}
</style>