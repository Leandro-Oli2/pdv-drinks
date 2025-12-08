import { createRouter, createWebHistory } from 'vue-router';
import LoginScreen from '@/views/LoginScreen.vue'; 
import PDVScreen from '@/views/PDVScreen.vue'; 
import ChefDashboard from '@/views/ChefScreen.vue'; 
import OrdersScreen from '@/views/OrdersScreen.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginScreen 
    },
    {
      path: '/pdv',
      name: 'pdv',
      component: PDVScreen 
    },
    {
      path: '/chef',
      name: 'chef',
      component: ChefDashboard
    },
    {
      path: '/orders',
      name: 'order',
      component: OrdersScreen
    }
  ]
});

export default router;