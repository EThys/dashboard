<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursorX = ref(0)
const cursorY = ref(0)
const cursorOutlineX = ref(0)
const cursorOutlineY = ref(0)
const isHovering = ref(false)
const isClicking = ref(false)

// Optimized animation loop
const updateCursorPosition = (e: MouseEvent) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
}

const animate = () => {
  const dx = cursorX.value - cursorOutlineX.value
  const dy = cursorY.value - cursorOutlineY.value
  
  cursorOutlineX.value += dx * 0.25
  cursorOutlineY.value += dy * 0.25
  
  requestAnimationFrame(animate)
}

const handleMouseEnter = () => isHovering.value = true
const handleMouseLeave = () => isHovering.value = false
const handleMouseDown = () => isClicking.value = true
const handleMouseUp = () => isClicking.value = false

onMounted(() => {
  animate()
  window.addEventListener('mousemove', updateCursorPosition)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
  
  // Add hover listeners to clickable elements
  const clickables = document.querySelectorAll('a, button, input, select, textarea, .cursor-hover')
  clickables.forEach(el => {
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursorPosition)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
    <!-- Main Dot -->
    <div 
      class="fixed w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      :style="{ left: `${cursorX}px`, top: `${cursorY}px` }"
      :class="{ 'scale-0': isHovering }"
    ></div>

    <!-- Outline Circle -->
    <div 
      class="fixed border-2 border-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out"
      :style="{ 
        left: `${cursorOutlineX}px`, 
        top: `${cursorOutlineY}px`,
        width: isHovering ? '60px' : '40px',
        height: isHovering ? '60px' : '40px',
        opacity: isHovering ? '0.5' : '0.3',
        backgroundColor: isHovering ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent'
      }"
      :class="{ 'scale-90': isClicking }"
    ></div>
  </div>
</template>

<style scoped>
:global(body) {
  cursor: none;
}

:global(a), :global(button), :global(input), :global(select), :global(textarea) {
  cursor: none;
}
</style>
