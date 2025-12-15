<template>
  <div class="min-h-screen bg-background flex flex-col lg:flex-row">
    
    <div class="flex-1 flex flex-col min-h-screen lg:min-h-0 overflow-x-hidden">
      
      <header class="bg-card/80 backdrop-blur-sm border-b border-border/50 p-3 sm:p-4 sticky top-0 z-20">
        <div class="flex items-center justify-between gap-2">
          <BarLogo size="sm" /> 
          <div class="flex items-center gap-2 sm:gap-4">
            
            <Button 
              variant="ghost" 
              size="icon" 
              @click="router.push('/orders')" 
              title="Ver Comandas Abertas"
            >
              <FileText class="h-5 w-5 text-primary" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              class="lg:hidden relative"
              @click="showOrderPanel = true"
            >
              <Menu class="h-5 w-5" />
              <span v-if="order.length > 0" class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {{ order.length }}
              </span>
            </Button>

            <Button variant="ghost" size="icon" @click="handleLogout">
              <LogOut class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div class="bg-card/50 border-b border-border/50 px-3 sm:px-4 pt-2 sm:pt-4 sticky top-[57px] sm:top-[73px] z-10">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <Button
            v-for="cat in categories"
            :key="cat"
            :variant="selectedCategory === cat ? 'default' : 'outline'"
            size="sm"
            @click="selectedCategory = cat"
            class="flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <component :is="categoryIcons[cat]" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ categoryLabels[cat] }}</span>
          </Button>
        </div>
      </div>

      <div class="p-3 sm:p-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            v-model="searchTerm"
            class="pl-10"
          />
        </div>
      </div>

      <div class="flex-1 overflow-auto p-3 sm:p-4 pb-24 lg:pb-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          
          <button
            v-for="product in filteredProducts"
            :key="product.id"
            @click="addToOrder(product.id, product.name, product.price)"
            class="glass-card p-3 sm:p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 active:scale-95"
          >
            <h3 class="font-medium text-foreground text-sm mb-1 line-clamp-2">
              {{ product.name }}
            </h3>
            <p class="text-primary font-semibold">
              R$ {{ product.price.toFixed(2) }}
            </p>
            <p v-if="product.description" class="text-xs text-muted-foreground mt-1 line-clamp-1">
              {{ product.description }}
            </p>
          </button>
          
          <div v-if="filteredProducts.length === 0" class="col-span-full text-center py-12 text-muted-foreground">
            Nenhum produto encontrado
          </div>
        </div>
      </div>

      <div v-if="order.length > 0" class="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 p-4 lg:hidden z-30">
        <Button 
          class="w-full"
          @click="showOrderPanel = true"
        >
          <span class="flex-1 text-left">
            {{ order.length }} {{ order.length === 1 ? 'item' : 'itens' }} • R$ {{ total.toFixed(2) }}
          </span>
          <span>Ver comanda</span>
        </Button>
      </div>
    </div>

    <aside class="hidden lg:flex w-80 bg-card border-l border-border/50 flex-col">
      <OrderPanel 
        :order="order"
        :tableNumber="tableNumber"
        :total="total"
        @updateQuantity="updateQuantity"
        @removeItem="removeItem"
        @handleSendOrder="handleSendOrder"
        @updateTableNumber="tableNumber = $event"
      />
    </aside>

    <div v-if="showOrderPanel" class="fixed inset-0 z-50 lg:hidden">
      <div class="absolute inset-0 bg-black/50" @click="showOrderPanel = false" />
      <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background flex flex-col animate-fade-in">
        <div class="p-4 border-b border-border/50 flex items-center justify-between bg-background">
          <h2 class="font-display text-xl text-foreground">
            Comanda
          </h2>
          <Button variant="ghost" size="icon" @click="showOrderPanel = false">
            <X class="h-5 w-5" />
          </Button>
        </div>
        <OrderPanel 
          :order="order"
          :tableNumber="tableNumber"
          :total="total"
          @updateQuantity="updateQuantity"
          @removeItem="removeItem"
          @handleSendOrder="handleSendOrder"
          @updateTableNumber="tableNumber = $event"
          hideHeader
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/UI/button.vue';
import Input from '@/components/UI/input.vue';
import BarLogo from '@/components/BarLogo.vue';
import OrderPanel from '@/components/OrderPanel.vue'; 
import { Wine, Coffee, UtensilsCrossed, Soup, Search, LogOut, Menu, X, FileText } from 'lucide-vue-next';
import { useAppStore } from '@/stores/drinkStore'; 
import type { Product, OrderItem, ProductCategory } from '@/data/mockData'; 

const categoryIcons: Record<ProductCategory, any> = {
  drinks: Wine,
  portions: Soup,
  food: UtensilsCrossed,
  "non-alcoholic": Coffee,
};

const categoryLabels: Record<ProductCategory, string> = {
  drinks: "Drinks",
  portions: "Porções",
  food: "Alimentos",
  "non-alcoholic": "Sem Álcool",
};

const categories: ProductCategory[] = ["drinks", "portions", "food", "non-alcoholic"];

const router = useRouter();
const appStore = useAppStore();

const tableNumber = ref("");
const selectedCategory = ref<ProductCategory>("drinks");
const order = ref<OrderItem[]>([]);
const searchTerm = ref("");
const showOrderPanel = ref(false);

const products = computed(() => appStore.products || []); 

const filteredProducts = computed(() => {
  if (!products.value || products.value.length === 0) {
      return [];
  }
    
  return products.value.filter(
    (p: Product) => 
      p.category === selectedCategory.value && 
      p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const total = computed(() => {
  return order.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
});

const addToOrder = (productId: string, productName: string, price: number) => {
  const existingIndex = order.value.findIndex((item) => item.productId === productId);
  
  if (existingIndex !== -1) {
    order.value[existingIndex].quantity++;
  } else {
    order.value = [...order.value, { productId, productName, quantity: 1, unitPrice: price }];
  }
  console.log(`${productName} adicionado!`); 
};

const updateQuantity = (productId: string, delta: number) => {
  order.value = order.value
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    )
    .filter((item) => item.quantity > 0);
};

const removeItem = (productId: string) => {
  order.value = order.value.filter((item) => item.productId !== productId);
};

const handleSendOrder = () => {
  if (!tableNumber.value || order.value.length === 0) {
    console.error("Informe o número da mesa e adicione itens"); 
    return;
  }
  
  const waiterId = appStore.currentUser?.type === 'waiter' ? (appStore.currentUser.data as any)?.id : 'w1';

  appStore.addOrder({
    tableNumber: tableNumber.value,
    items: order.value,
    total: total.value,
    status: "open", 
    waiterId: waiterId,
  });
  
  console.log(`Pedido enviado para Mesa ${tableNumber.value}!`); 
  
  order.value = [];
  tableNumber.value = "";
  showOrderPanel.value = false;
};

const handleLogout = () => {
  appStore.logout();
  router.push('/');
};
</script>

<style scoped>
.glass-card {
  background-color: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.6rem;
}
</style>