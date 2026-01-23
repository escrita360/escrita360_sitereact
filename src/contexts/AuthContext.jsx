import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, firebaseAuthService } from '@/services/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Buscar dados completos do usuário do Firestore
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', firebaseUser.uid))
          const userData = userDoc.exists() ? userDoc.data() : {}
          setUser({
            ...firebaseUser,
            ...userData
          })
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error)
          setUser(firebaseUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    const result = await firebaseAuthService.login(email, password)
    return result
  }

  const register = async (email, password, userData) => {
    const result = await firebaseAuthService.register(email, password, userData)
    return result
  }

  const logout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}