<template>
  <div class="flex items-center gap-3">
    <div class="relative">
      <div class="absolute inset-0 blur-xl bg-yellow-500/40 rounded-full" />
      
      <Wine class="relative h-10 w-10 text-yellow-500" :stroke-width="1.5" />
    </div>

    <div class="flex flex-col">
      <span class="font-display text-2xl font-semibold tracking-wide text-white">
        ÂMBAR
      </span>
      <span class="text-xs tracking-[0.3em] text-gray-400 uppercase">
        Cocktail Bar
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importação do ícone Wine (Taça de Vinho)
import { Wine } from 'lucide-vue-next'; 

// Nota: Removemos as classes React específicas (font-display, text-foreground, text-muted-foreground) 
// e as substituímos pelas classes Tailwind que definimos (text-white, text-gray-400).

// Não há props ou lógica reativa complexa, apenas a estrutura visual.
</script>