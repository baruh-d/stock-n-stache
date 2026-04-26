import type { Product, Debt, Sale, Store } from "./types"

export const mockStore: Store = {
  id: "store-1",
  name: "Downtown Liquors",
  ownerPhone: "+254 712 345 678",
  primaryColor: "#f59e0b",
}

export const mockProducts: Product[] = [
  { id: "1", name: "Johnnie Walker Black", category: "Whisky", price: 4500, quantity: 12, bottleSize: "750ml" },
  { id: "2", name: "Jameson Irish", category: "Whisky", price: 3200, quantity: 8, bottleSize: "750ml" },
  { id: "3", name: "Smirnoff Vodka", category: "Vodka", price: 1800, quantity: 3, bottleSize: "750ml" },
  { id: "4", name: "Captain Morgan", category: "Rum", price: 2500, quantity: 15, bottleSize: "750ml" },
  { id: "5", name: "Hennessy VS", category: "Cognac", price: 5800, quantity: 6, bottleSize: "700ml" },
  { id: "6", name: "Tusker Lager", category: "Beer", price: 250, quantity: 48, bottleSize: "500ml" },
  { id: "7", name: "White Cap", category: "Beer", price: 220, quantity: 2, bottleSize: "500ml" },
  { id: "8", name: "Gordon's Gin", category: "Gin", price: 2200, quantity: 10, bottleSize: "750ml" },
]

export const mockDebts: Debt[] = [
  { id: "1", customerName: "John Kamau", amount: 3500, status: "pending", date: "2024-01-15", note: "2x Smirnoff" },
  { id: "2", customerName: "Mary Wanjiku", amount: 5000, status: "pending", date: "2024-01-18" },
  { id: "3", customerName: "Peter Ochieng", amount: 1200, status: "pending", date: "2024-01-20", note: "Beer on credit" },
  { id: "4", customerName: "Grace Muthoni", amount: 8500, status: "pending", date: "2024-01-10" },
]

export const mockSales: Sale[] = [
  { id: "1", productId: "1", productName: "Johnnie Walker Black", quantity: 2, total: 9000, paid: true, date: "2024-01-22" },
  { id: "2", productId: "6", productName: "Tusker Lager", quantity: 12, total: 3000, paid: true, date: "2024-01-22" },
  { id: "3", productId: "3", productName: "Smirnoff Vodka", quantity: 1, total: 1800, paid: false, date: "2024-01-22" },
]
