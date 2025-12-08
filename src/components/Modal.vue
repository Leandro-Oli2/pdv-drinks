<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    
    <div class="absolute inset-0 bg-black/70" @click="$emit('close')"></div>
    
    <div 
      class="relative bg-dark-card rounded-xl shadow-2xl animate-scale-in 
             w-full max-w-lg max-h-full overflow-y-auto"
      @click.stop 
    >
      <div class="flex justify-between items-center px-4 pt-4 pb-3 border-b border-border/50 sticky top-0 bg-dark-card z-10">
        <h3 class="text-xl font-display font-bold text-foreground">
          <slot name="title">Título Padrão</slot>
        </h3>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <X class="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>

      <div class="modal-content px-4 py-4 sm:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/UI/button.vue';
import { X } from 'lucide-vue-next';

defineEmits(['close']);
</script>

<style scoped>
.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}
</style>