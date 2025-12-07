<template>
  <label
    :for="forId"
    :class="labelClasses"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// --- Utilitário de Concatenação de Classes (Reutilizado) ---
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Propriedades (Props) ---
interface LabelProps {
  // Corresponde ao 'htmlFor' no React ou 'for' no HTML. Essencial para acessibilidade.
  forId?: string;
  className?: string;
}

const props = defineProps<LabelProps>();

// --- Classes Base (Equivalente ao `cva` no React) ---
const baseClasses = 'text-sm font-medium leading-none';

// Classes para estados: quando o input associado está desabilitado
// No Vue, você precisaria de lógica externa ou props para saber o estado do 'peer'
// Por simplicidade no protótipo, aplicaremos apenas as classes base e de acessibilidade.
const accessibilityClasses = 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

// --- Propriedade Computada Final ---
const labelClasses = computed(() => {
  // Concatena as classes base, de acessibilidade e qualquer classe externa passada
  return cn(baseClasses, accessibilityClasses, props.className);
});

// Nota: O 'for' (no Vue) é ligado à prop 'forId'
</script>