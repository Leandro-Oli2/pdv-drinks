<template>
  <div class="min-h-screen relative flex items-center justify-center overflow-hidden">
    
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${barBgImage})` }"
    />
    
    <div className="absolute inset-0 bg-black/85" />
    
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] animate-pulse" />
    <div 
      className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] animate-pulse" 
      style="animation-delay: 1s;" 
    />

    <div class="relative z-10 w-full max-w-md px-6">
      
      <div class="flex justify-center mb-10">
        <BarLogo />
      </div>

      <div class="glass-card rounded-2xl p-8 shadow-2xl backdrop-blur-md" style="background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1);">
        
        <div class="text-center mb-8">
          <h1 class="font-display text-3xl font-semibold text-white mb-2">
            Bem-vindo de volta
          </h1>
          <p class="text-gray-400">
            Entre para acessar seu perfil exclusivo
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          
          <div class="space-y-2">
            <Label forId="username-input" class="text-white/80">Matrícula</Label>
            <div class="relative">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="username-input"
                type="text"
                placeholder="Ex: garcom1 ou chef1"
                v-model="username"
                className="pl-12"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label forId="password-input" class="text-white/80">Senha</Label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                {{ showPassword ? "Ocultar" : "Mostrar" }}
              </button>
            </div>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password-input"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                v-model="password"
                className="pl-12 pr-12"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <EyeOff v-if="showPassword" class="h-5 w-5" />
                <Eye v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="error" class="text-red-400 text-sm mt-2">{{ error }}</p>
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            class="w-full mt-6"
          >
            <span>Acessar PDV</span>
            <ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>
        
      </div>
      
      <p class="text-center text-sm text-gray-400/60 mt-8">
        Ao continuar, você concorda com nossos
        <a href="#" class="text-yellow-500 hover:text-yellow-400 transition-colors underline">Termos de Uso</a>
        e
        <a href="#" class="text-yellow-500 hover:text-yellow-400 transition-colors underline">Política de Privacidade</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BarLogo from '@/components/BarLogo.vue'; 
import Button from '@/components/UI/Button.vue'; 
import Input from '@/components/UI/Input.vue'; 
import Label from '@/components/UI/Label.vue'; 
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-vue-next'; 
import barBgImage from '@/assets/bar-bg.jpg'; 

const router = useRouter();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");

const USERS = {
    'garcom1': { password: '123', route: '/pdv' },
    'chef1': { password: '456', route: '/chef' }
};

const handleSubmit = () => {
  error.value = "";
  const userKey = username.value.toLowerCase();
  
  if (USERS[userKey] && USERS[userKey].password === password.value) {
      router.push(USERS[userKey].route);
  } else {
      error.value = 'Matrícula ou senha inválidos. Tente "garcom1" ou "chef1".';
  }
};
</script>

<style scoped>
/* Estilos para o Glass Card, etc. */
.glass-card {
    /* backdrop-filter: blur(10px); */
}
</style>