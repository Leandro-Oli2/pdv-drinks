// tailwind.config.js - Configuração Final

// Função para simular 'require' em Node.js para plugins
const plugin = require("tailwindcss/plugin"); 

export default {
  // Mantemos o darkMode
  darkMode: ["class"],
  
  // AJUSTE: Caminhos do content para projetos Vue (componentes e views)
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Padrão Vue/Vite
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./views/**/*.{vue,js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      
      // Cores: Adaptando HSL para Cores Sólidas (Tema Dourado/Escuro)
      colors: {
        // Cores Primárias do nosso tema (Dourado/Escuro)
        background: '#0d1117', // Fundo principal escuro (quase preto)
        foreground: '#ffffff', // Texto principal branco
        
        // NOVO: Cor de fundo para os cards de listagem de Garçons
        'dark-card': '#12100e', 
        
        primary: {
          // Amarelo Vibrante (para destaque e botões de ação principal)
          DEFAULT: '#e2a336', 
          foreground: '#000000', // Texto preto sobre o amarelo
        },
        secondary: {
          // Cor Cinza Chumbo Escuro (para fundos de componentes/cards secundários)
          DEFAULT: '#231d1a', 
          foreground: '#ffffff',
        },
        destructive: {
           // Cor de erro
           DEFAULT: '#ef4444', 
           foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#16a249',
          foreground: '#ffffff',
        },
        
        // Mantemos a estrutura HSL para variáveis
        border: "hsl(var(--border, 215 27% 17%))",
        input: "hsl(var(--input, 215 27% 17%))",
        ring: "hsl(var(--ring, 38 75% 55%))", // Ring Dourado
        muted: {
           DEFAULT: "hsl(var(--muted, 215 27% 17%))",
           foreground: "hsl(var(--muted-foreground, 215 14% 65%))",
        },
      },
      
      borderRadius: {
        lg: "var(--radius, 0.75rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.25rem) - 4px)",
      },
      
      // Keyframes
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      
      // Animações
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
    },
  },
  
  // Adiciona o plugin de animação
  plugins: [require("tailwindcss-animate")],
}