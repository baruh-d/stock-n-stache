"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product, Debt, Sale, Store, StoreColors } from "./types"
import { mockStore, mockProducts, mockDebts, mockSales } from "./mock-data"

// Re-export types for backwards compatibility
export type { Product, Debt, Sale, Store, StoreColors }

interface StoreContextType {
  // Store info
  currentStoreId: string
  storeName: string
  storeColors: StoreColors
  store: Store
  
  // Data
  products: Product[]
  debts: Debt[]
  sales: Sale[]
  
  // Loading & Error states
  isLoading: boolean
  error: string | null
  
  // Product actions
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Debt actions
  addDebt: (debt: Omit<Debt, "id">) => void
  markDebtAsPaid: (id: string) => void
  
  // Sale actions
  addSale: (sale: Omit<Sale, "id">) => void
  
  // Store actions
  updateStore: (store: Partial<Store>) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(mockStore)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [debts, setDebts] = useState<Debt[]>(mockDebts)
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)

  // Derived values for easy access
  const currentStoreId = store.id
  const storeName = store.name
  const storeColors: StoreColors = {
    primary: store.primaryColor,
    secondary: store.secondaryColor,
  }

  const addProduct = (product: Omit<Product, "id">) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: crypto.randomUUID(), storeId: currentStoreId },
    ])
  }

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...product, updatedAt: new Date().toISOString() } : p))
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addDebt = (debt: Omit<Debt, "id">) => {
    setDebts((prev) => [
      ...prev,
      { ...debt, id: crypto.randomUUID(), storeId: currentStoreId },
    ])
  }

  const markDebtAsPaid = (id: string) => {
    setDebts((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "paid" as const, paidAt: new Date().toISOString() } : d
      )
    )
  }

  const addSale = (sale: Omit<Sale, "id">) => {
    setSales((prev) => [
      ...prev,
      { ...sale, id: crypto.randomUUID(), storeId: currentStoreId },
    ])
    // Update product quantity
    setProducts((prev) =>
      prev.map((p) =>
        p.id === sale.productId
          ? { ...p, quantity: Math.max(0, p.quantity - sale.quantity) }
          : p
      )
    )
    // If not paid, add to debts
    if (!sale.paid) {
      addDebt({
        customerName: "Walk-in Customer",
        amount: sale.total,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        note: `${sale.quantity}x ${sale.productName}`,
      })
    }
  }

  const updateStore = (updates: Partial<Store>) => {
    setStore((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }))
  }

  return (
    <StoreContext.Provider
      value={{
        currentStoreId,
        storeName,
        storeColors,
        store,
        products,
        debts,
        sales,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addDebt,
        markDebtAsPaid,
        addSale,
        updateStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
