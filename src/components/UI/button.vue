<template>
  <button
    :class="buttonClasses"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'hero' | 'premium';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'default',
  type: 'button',
  disabled: false,
});


const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

// --- Mapeamento de Tamanhos ---
const sizeMap = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-10 rounded-md px-4';
    case 'lg':
      return 'h-14 rounded-lg px-8 text-base';
    case 'icon':
      return 'h-10 w-10';
    case 'default':
    default:
      return 'h-12 px-6 py-3';
  }
});

// --- Mapeamento de Variantes (ESTILOS SEM SOMBRA) ---
const variantMap = computed(() => {
  switch (props.variant) {
    case 'destructive':
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
    case 'outline':
      return 'border border-border bg-transparent text-primary hover:bg-secondary hover:border-primary/50';
    case 'secondary':
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    case 'terciary':
      return 'bg-[#231d1a] text-secondary-foreground hover:bg-[#342d2a]';
    case 'ghost':
      return 'text-foreground hover:bg-secondary hover:text-foreground';
    case 'link':
      return 'text-primary underline-offset-4 hover:underline';
      
    case 'hero':
      return 'bg-primary text-primary-foreground font-semibold shadow-none hover:bg-primary/90 active:scale-[0.98]';

    case 'premium': 

      return 'bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.98]';
      
    case 'default':
    default:

      return 'bg-primary text-primary-foreground hover:bg-primary/90';
  }
});

const buttonClasses = computed(() => {

  return cn(baseClasses, sizeMap.value, variantMap.value);
});


defineEmits(['click']);
</script>