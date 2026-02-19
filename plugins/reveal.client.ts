export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
          // Once animated, stop observing
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Helper to find and observe elements
    const refreshObservers = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      elements.forEach(el => {
        if (!el.classList.contains('active')) {
          observer.observe(el)
        }
      })
    }

    // Initial run
    onNuxtReady(() => {
      refreshObservers()
      
      // Also observe for dynamic content changes
      const mutationObserver = new MutationObserver(refreshObservers)
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    })

    return {
      provide: {
        reveal: {
          refresh: refreshObservers
        }
      }
    }
  }
})
