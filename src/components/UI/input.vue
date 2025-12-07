<template>
  <input
    :type="type"
    :class="inputClasses"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

// --- Utilitário de Concatenação de Classes ---
// Se você não usa uma biblioteca, use esta função.
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Propriedades (Props) ---
interface InputProps {
  // Equivalente a React.ComponentProps<'input'>, mas com foco em Vue
  type?: string;
  className?: string;
  // Propriedade padrão do Vue 3 para v-model
  modelValue?: string | number;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  className: '',
  modelValue: undefined,
});

// Desabilita a herança de atributos para que classes e estilos sejam aplicados corretamente
defineOptions({
  inheritAttrs: false
});


// --- Classes Base (Adaptadas para o Dark Mode/Glassmorphism) ---
const baseClasses = `
  flex h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-base text-white
  transition-all duration-300
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500
  hover:border-yellow-500/50
  disabled:cursor-not-allowed disabled:opacity-50
  file:border-0 file:bg-transparent file:text-sm file:font-medium
`;

// --- Propriedade Computada Final ---
const inputClasses = computed(() => {
  // Combina as classes base com as classes customizadas passadas via prop
  return cn(baseClasses, props.className);
});

// Define eventos que o componente pode emitir (essencial para v-model)
defineEmits(['update:modelValue']);
</script>