"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthStore {
  id: string
  name: string
  pin: string
  ownerPhone: string
}

interface AuthContextType {
  isAuthenticated: boolean
  currentStore: AuthStore | null
  isLoading: boolean
  login: (storeId: string, pin: string) => boolean
  logout: () => void
  availableStores: AuthStore[]
}

// Mock stores with PINs for simulation
const mockStores: AuthStore[] = [
  { id: "store-1", name: "Downtown Liquors", pin: "1234", ownerPhone: "+254 712 345 678" },
  { id: "store-2", name: "Westlands Wines", pin: "5678", ownerPhone: "+254 722 987 654" },
  { id: "store-3", name: "CBD Spirits", pin: "0000", ownerPhone: "+254 733 456 789" },
]

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentStore, setCurrentStore] = useState<AuthStore | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedSession = localStorage.getItem("barledger_session")
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        const store = mockStores.find((s) => s.id === session.storeId)
        if (store) {
          setCurrentStore(store)
          setIsAuthenticated(true)
        }
      } catch {
        localStorage.removeItem("barledger_session")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (storeId: string, pin: string): boolean => {
    const store = mockStores.find((s) => s.id === storeId)
    if (store && store.pin === pin) {
      setCurrentStore(store)
      setIsAuthenticated(true)
      localStorage.setItem("barledger_session", JSON.stringify({ storeId }))
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentStore(null)
    setIsAuthenticated(false)
    localStorage.removeItem("barledger_session")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentStore,
        isLoading,
        login,
        logout,
        availableStores: mockStores,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
