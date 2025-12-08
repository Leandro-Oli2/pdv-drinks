<template>
  <div class="min-h-screen bg-background">
    
    <header class="p-4 border-b border-border/50 sticky top-0 z-10 bg-card/80 backdrop-blur-sm">
      <div class="container mx-auto flex items-center justify-between">
        
        <Button variant="ghost" size="icon" @click="router.back()">
          <ArrowLeft class="w-6 h-6 text-foreground" />
        </Button>
        
        <h1 class="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <ListOrdered class="w-5 h-5 text-primary hidden sm:block" />
          
          <span class="sm:hidden">Comandas</span>
          <span class="hidden sm:inline">Gerenciamento de Comandas</span>
        </h1>
        
        <div class="w-10"></div>
      </div>
    </header>

    <main class="container mx-auto p-4 lg:p-8">
      
      <div class="flex gap-4 mb-6">
        <Button 
            :variant="activeFilter === 'open' ? 'default' : 'secondary'" 
            @click="activeFilter = 'open'"
        >
            Abertas
        </Button>
        <Button 
            :variant="activeFilter === 'closed' ? 'default' : 'secondary'" 
            @click="activeFilter = 'closed'"
        >
            Fechadas
        </Button>
      </div>

      <div v-if="filteredOrders.length === 0" class="text-center py-20 text-muted-foreground">
        <Coffee class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p v-if="activeFilter === 'open'" class="text-lg">Nenhuma comanda em aberto no momento.</p>
        <p v-else class="text-lg">Nenhuma comanda foi fechada ainda.</p>
        <p class="text-sm">Hora de fechar o caixa ou esperar por mais clientes!</p>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="order in filteredOrders"
          :key="order.id"
          class="glass rounded-xl p-5 space-y-3 cursor-pointer hover:bg-secondary/50 transition"
        >
          <div class="flex justify-between items-center border-b border-border/50 pb-2">
            <span class="text-sm font-semibold text-primary">
              MESA #{{ order.tableNumber }}
            </span>
            <span :class="['text-xs font-medium px-2 py-1 rounded-full', statusClass(order.status)]">
              {{ order.status === 'open' ? 'Em Aberto' : (order.status === 'pending' ? 'Pendente' : 'Fechada') }}
            </span>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-muted-foreground text-sm">
              Garçom: <span class="text-foreground font-medium">{{ getWaiterName(order.waiterId) }}</span>
            </div>
            <div class="text-2xl font-bold text-primary">
              R$ {{ order.total.toFixed(2) }}
            </div>
          </div>

          <ul class="text-xs text-muted-foreground list-disc pl-4 space-y-1">
            <li v-for="item in order.items.slice(0, 3)" :key="item.id">
              {{ item.quantity }}x {{ item.productName }}
            </li>
            <li v-if="order.items.length > 3">
              e mais {{ order.items.length - 3 }} itens...
            </li>
          </ul>

          <div class="pt-3 border-t border-border/50 flex justify-end gap-2">
            <Button variant="outline" size="sm" class="flex-1" @click="showDetailsModal(order)">
                Detalhes
            </Button>
            
            <Button 
                v-if="activeFilter !== 'closed'"
                variant="success" 
                size="sm" 
                @click="appStore.updateOrderStatus(order.id, 'closed')"
            >
                Fechar Comanda
            </Button>
          </div>
        </div>
      </div>
    </main>

    <Modal v-if="selectedOrderDetails" @close="closeDetailsModal">
        <template #title>
            Detalhes da Mesa #{{ selectedOrderDetails.tableNumber }}
        </template>

        <div v-if="selectedOrderDetails" class="space-y-4">
            
            <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Garçom:</span>
                <span class="text-foreground font-medium">{{ getWaiterName(selectedOrderDetails.waiterId) }}</span>
            </div>
            
            <div class="flex justify-between text-sm pb-2 border-b border-border/50">
                <span class="text-muted-foreground">Status:</span>
                <span :class="['text-foreground font-medium px-2 py-1 rounded-full', statusClass(selectedOrderDetails.status)]">
                    {{ selectedOrderDetails.status === 'open' ? 'Em Aberto' : (selectedOrderDetails.status === 'pending' ? 'Pendente' : 'Fechada') }}
                </span>
            </div>
            
            <h4 class="font-semibold text-lg text-foreground">Itens do Pedido ({{ selectedOrderDetails.items.length }})</h4>
            
            <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                <div 
                    v-for="(item, index) in selectedOrderDetails.items" 
                    :key="index"
                    class="flex justify-between items-center text-sm border-b border-border/50 last:border-b-0 pb-1"
                >
                    <span class="text-foreground">{{ item.quantity }}x {{ item.productName }}</span>
                    <span class="text-muted-foreground">R$ {{ (item.unitPrice * item.quantity).toFixed(2) }}</span>
                </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-border/50">
                <span class="text-xl text-muted-foreground">TOTAL:</span>
                <span class="text-3xl font-bold text-primary">R$ {{ selectedOrderDetails.total.toFixed(2) }}</span>
            </div>
            
            <div class="pt-4">
                 <Button 
                    v-if="selectedOrderDetails.status !== 'closed'"
                    variant="success" 
                    class="w-full"
                    @click="appStore.updateOrderStatus(selectedOrderDetails.id, 'closed'); closeDetailsModal();"
                >
                    Fechar Comanda e Pagar
                </Button>
            </div>
        </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/drinkStore'; 
import Button from '@/components/UI/button.vue'; 
import Modal from '@/components/Modal.vue'; 
import { ListOrdered, ArrowLeft, Coffee } from 'lucide-vue-next'; 
import type { Order } from '@/data/mockData';

const router = useRouter();
const appStore = useAppStore();

const selectedOrderDetails = ref(null as Order | null);
const activeFilter = ref<'open' | 'closed'>('open');

const allOrders = computed(() => appStore.orders || []);
const allWaiters = computed(() => appStore.waiters || []);

const filteredOrders = computed(() => {
    const all = allOrders.value;

    if (activeFilter.value === 'open') {
        return all.filter(o => o.status === 'open' || o.status === 'pending');
    } else {
        return all.filter(o => o.status === 'closed');
    }
});

const showDetailsModal = (order: Order) => {
    selectedOrderDetails.value = order;
};

const closeDetailsModal = () => {
    selectedOrderDetails.value = null;
};

const getWaiterName = (waiterId: string) => {
    const waiter = allWaiters.value.find(w => w.id === waiterId);
    return waiter ? waiter.name : 'Desconhecido';
};

const statusClass = (status: Order['status']) => {
    switch (status) {
        case 'open':
            return 'bg-success/20 text-success';
        case 'pending':
            return 'bg-primary/20 text-primary';
        case 'closed':
        default:
            return 'bg-muted text-muted-foreground';
    }
};
</script>

<style scoped>
.glass {
  background-color: rgba(255, 255, 255, 0.08); 
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>