import { useEffect, useRef } from 'react'

export function useScrollAnimation(options = {}) {
  const elementRef = useRef(null)
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('visible')
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return elementRef
}
