import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, getIdTokenResult } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, firebaseAuthService, getActiveAuth, getActiveDb, authAluno, authProfessor, dbAluno, dbProfessor } from '@/services/firebase'

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
  const [claims, setClaims] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handler compartilhado para processar login de qualquer projeto
    const handleAuthUser = async (firebaseUser) => {
      if (firebaseUser) {
        // Buscar custom claims (role, plan, app) do token
        try {
          const tokenResult = await getIdTokenResult(firebaseUser)
          const userClaims = tokenResult.claims || {}
          setClaims({
            role: userClaims.role || null,
            plan: userClaims.plan || null,
            app: userClaims.app || null,
            planType: userClaims.planType || null,
            subscriptionStatus: userClaims.subscriptionStatus || null
          })
        } catch (claimsError) {
          console.error('Erro ao buscar claims do token:', claimsError)
          setClaims(null)
        }

        // Usar o Firestore do projeto ativo (aluno ou professor)
        const activeDb = getActiveDb()
        try {
          const userDoc = await getDoc(doc(activeDb, 'usuarios', firebaseUser.uid))
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
        // Só limpar estado se nenhum dos projetos tem usuário logado
        if (!authAluno.currentUser && !authProfessor.currentUser) {
          setUser(null)
          setClaims(null)
        }
      }
      setLoading(false)
    }

    // Escutar auth state de AMBOS os projetos
    const unsubAluno = onAuthStateChanged(authAluno, handleAuthUser)
    const unsubProfessor = onAuthStateChanged(authProfessor, handleAuthUser)

    return () => {
      unsubAluno()
      unsubProfessor()
    }
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
      // Sign out de ambos os projetos
      const promises = []
      if (authAluno.currentUser) promises.push(signOut(authAluno))
      if (authProfessor.currentUser) promises.push(signOut(authProfessor))
      if (promises.length === 0) promises.push(signOut(authAluno))
      await Promise.all(promises)
      localStorage.removeItem('user')
      setUser(null)
      setClaims(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    // Verificar em ambos os projetos qual tem usuário logado
    const firebaseUser = authAluno.currentUser || authProfessor.currentUser
    if (!firebaseUser) return
    const activeDb = getActiveDb()
    try {
      const userDoc = await getDoc(doc(activeDb, 'usuarios', firebaseUser.uid))
      const userData = userDoc.exists() ? userDoc.data() : {}
      setUser({ ...firebaseUser, ...userData })
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error)
    }
  }

  const value = {
    user,
    claims,
    loading,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}