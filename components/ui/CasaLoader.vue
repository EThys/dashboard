<script setup lang="ts">
const props = defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

const sizeClasses: Record<string, string> = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
}

const currentSize = computed(() => props.size || 'md')
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-10">
    <div :class="['relative flex items-center justify-center', sizeClasses[currentSize]]">
      
      <!-- 1. Deep Background Glow (Breathing) -->
      <div class="absolute inset-[-40%] rounded-full bg-primary/5 blur-[60px] animate-[pulse_4s_ease-in-out_infinite]"></div>
      
      <!-- 2. Rotating Orbital Particles -->
      <div class="absolute inset-[-20%] animate-[spin_8s_linear_infinite]">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/40 blur-[1px]"></div>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/20 blur-[1px]"></div>
      </div>
      <div class="absolute inset-[-25%] animate-[spin_12s_linear_infinite_reverse]">
        <div class="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/30 blur-[1px]"></div>
        <div class="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/10 blur-[1px]"></div>
      </div>

      <!-- 3. Staggered Spinning Rings -->
      <!-- Outer Ring -->
      <div class="absolute inset-0 rounded-full border-[1px] border-primary/5"></div>
      <div class="absolute inset-0 rounded-full border-t-[3px] border-primary/60 animate-[spin_2s_cubic_bezier(0.4,0,0.2,1)_infinite]"></div>
      
      <!-- Middle Ring -->
      <div class="absolute inset-4 rounded-full border-[1px] border-primary/5"></div>
      <div class="absolute inset-4 rounded-full border-r-[2px] border-primary/40 animate-[spin_3s_linear_infinite_reverse]"></div>
      
      <!-- Inner Ring -->
      <div class="absolute inset-8 rounded-full border-[1px] border-primary/5"></div>
      <div class="absolute inset-8 rounded-full border-l-[2px] border-primary/20 animate-[spin_1.5s_ease-in-out_infinite]"></div>

      <!-- 4. Center Logo Container -->
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="relative w-full h-full flex items-center justify-center">
            <!-- Logo with Floating & Pulse motion -->
            <div class="animate-[float_3s_ease-in-out_infinite]">
                <img 
                    src="/logoCasa.png" 
                    alt="CasaNayo" 
                    class="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(27,67,50,0.4)] transition-all duration-700 hover:scale-110"
                />
            </div>
            
            <!-- Shine effect passing through -->
            <div class="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <div class="absolute -inset-full bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 animate-[shine_3s_infinite]"></div>
            </div>
        </div>
      </div>
    </div>
    
    <!-- 5. Premium Text with Letter Animation -->
    <div class="flex flex-col items-center gap-3">
      <div class="relative">
        <span class="text-2xl font-black text-primary tracking-[0.3em] uppercase flex overflow-hidden">
            <span v-for="(char, i) in 'CASANAYO'" :key="i" 
                  class="animate-[slide-up_0.5s_ease-out_forwards]"
                  :style="{ animationDelay: `${i * 0.05}s` }">
                {{ char }}
            </span>
        </span>
        <!-- Underline expansion -->
        <div class="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 animate-[scale-x_1s_ease-out_forwards_0.5s]"></div>
      </div>
      
      <!-- Moving Dots -->
      <div class="flex gap-2">
        <div class="w-1 w-1 bg-primary/40 rounded-full animate-loader-dot-1"></div>
        <div class="w-1 w-1 bg-primary/40 rounded-full animate-loader-dot-2"></div>
        <div class="w-1 w-1 bg-primary/40 rounded-full animate-loader-dot-3"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes shine {
  0% { transform: translate(-100%, -100%) rotate(45deg); }
  100% { transform: translate(100%, 100%) rotate(45deg); }
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scale-x {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.animate-loader-dot-1 { animation: loader-dot 1.4s infinite ease-in-out both; animation-delay: -0.32s; }
.animate-loader-dot-2 { animation: loader-dot 1.4s infinite ease-in-out both; animation-delay: -0.16s; }
.animate-loader-dot-3 { animation: loader-dot 1.4s infinite ease-in-out both; }

@keyframes loader-dot {
  0%, 80%, 100% { transform: scale(0); opacity: 0; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes spin-linear {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
