import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function PageTransition({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timeout = setTimeout(() => {
        setTransitionStage('fadeIn')
        setDisplayLocation(location)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [transitionStage, location])

  return (
    <div
      className={`${
        transitionStage === 'fadeIn' ? 'animate-fade-in' : 'opacity-0'
      } transition-opacity duration-300`}
    >
      {children}
    </div>
  )
}
