<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="bg-gray-800 p-4 shadow-md flex justify-center space-x-6">
    <RouterLink 
      to="/" 
      class="text-xl font-bold text-gray-300 hover:text-yellow-400 transition"
      active-class="text-yellow-400 border-b-2 border-yellow-400"
    >
      Login Garçom (PDV)
    </RouterLink>
    <RouterLink 
      to="/chef" 
      class="text-xl font-bold text-gray-300 hover:text-red-400 transition"
      active-class="text-red-400 border-b-2 border-red-400"
    >
      Login Chef (Controle)
    </RouterLink>
    <RouterLink 
      to="/pdv" 
      class="text-xl font-bold text-gray-300 hover:text-red-400 transition"
      active-class="text-red-400 border-b-2 border-red-400"
    >
      Login pdv (seila)
    </RouterLink>
  </header>

  <main class="h-[calc(100vh-68px)]"> 
    <RouterView />
  </main>
</template>