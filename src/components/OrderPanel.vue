<template>
  <div class="flex flex-col h-full">
    
    <div class="p-4 border-b border-border/50 bg-card">
      <h2 v-if="!hideHeader" class="font-display text-xl text-foreground mb-4">
        Comanda
      </h2>
      
      <div class="flex items-center gap-2">
        <span class="text-muted-foreground text-sm flex-shrink-0">Mesa N°:</span>
        <Input
          type="number"
          placeholder="Ex: 5"
          :model-value="tableNumber"
          @update:model-value="$emit('updateTableNumber', $event)"
          class="w-full text-center"
        />
      </div>
    </div>

    <div class="flex-1 overflow-auto p-4 space-y-3">
      <div v-if="order.length === 0" class="text-center text-muted-foreground py-8">
        <Wine class="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p class="text-sm">Nenhum item na comanda</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="item in order"
          :key="item.productId"
          class="glass-card p-3 flex items-center gap-3"
        >
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-foreground truncate">
              {{ item.productName }}
            </h4>
            <p class="text-xs text-muted-foreground">
              R$ {{ item.unitPrice.toFixed(2) }} cada
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              class="h-7 w-7"
              @click="updateQuantity(item.productId, -1)"
            >
              <Minus class="h-3 w-3" />
            </Button>
            <span class="w-6 text-center text-sm font-medium">
              {{ item.quantity }}
            </span>
            <Button
              variant="secondary"
              size="icon"
              class="h-7 w-7"
              @click="updateQuantity(item.productId, 1)"
            >
              <Plus class="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-7 w-7 text-destructive hover:text-destructive"
              @click="removeItem(item.productId)"
            >
              <Trash2 class="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-border/50 space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Total:</span>
        <span class="text-2xl font-display text-primary">
          R$ {{ total.toFixed(2) }}
        </span>
      </div>
      <Button
        @click="handleSendOrder"
        :disabled="!tableNumber || order.length === 0"
        class="w-full"
      >
        <Send class="h-4 w-4 mr-2" />
        Enviar Pedido
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/UI/Button.vue';
import Input from '@/components/UI/Input.vue';
import { Wine, Minus, Plus, Trash2, Send } from 'lucide-vue-next';
import type { OrderItem } from '@/data/mockData'; 

interface OrderPanelProps {
  order: OrderItem[];
  tableNumber: string;
  total: number;
  hideHeader?: boolean;
}

const props = defineProps<OrderPanelProps>();

const emit = defineEmits(['updateQuantity', 'removeItem', 'handleSendOrder', 'updateTableNumber']);

const updateQuantity = (id: string, delta: number) => {
  emit('updateQuantity', id, delta);
};

const removeItem = (id: string) => {
  emit('removeItem', id);
};

const handleSendOrder = () => {
  emit('handleSendOrder');
};
</script>

<style scoped>
.glass-card {
  background-color: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
}
</style>