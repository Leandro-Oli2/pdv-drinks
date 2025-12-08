<template>
  <div :class="['flex items-center gap-3', mainWrapperClass]">
    
    <div class="relative">
      <div :class="['absolute inset-0 blur-xl bg-yellow-500/40 rounded-full', iconSizeClass]" />
      
      <Wine :class="['relative text-yellow-500', iconSizeClass]" :stroke-width="1.5" />
    </div>

    <div class="flex flex-col">
      <span :class="['font-display font-semibold tracking-wide text-white', titleSizeClass]">
        The Wolf
      </span>
      
      <span :class="['tracking-[0.3em] text-yellow-500 uppercase', rooftopSizeClass]">
        ROOFTOP
      </span>
      
      <span :class="['tracking-[0.2em] text-gray-400 uppercase', sloganSizeClass]">
        WALL STREET EXPERIENCE
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Wine } from 'lucide-vue-next'; 

// 1. Definição da prop para o controle de tamanho
const props = defineProps<{
  size?: 'sm' | 'lg'; // 'sm' para headers, 'lg' para login
}>();

// 2. Computed properties para classes dinâmicas
const isSmall = computed(() => props.size === 'sm');

const mainWrapperClass = computed(() => isSmall.value ? 'gap-2' : 'gap-3');

const iconSizeClass = computed(() => isSmall.value ? 'h-8 w-8' : 'h-10 w-10');

const titleSizeClass = computed(() => isSmall.value ? 'text-xl' : 'text-2xl');

const rooftopSizeClass = computed(() => isSmall.value ? 'text-xs' : 'text-sm');

const sloganSizeClass = computed(() => isSmall.value ? 'text-[10px]' : 'text-xs');
</script>