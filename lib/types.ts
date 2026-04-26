export interface Product {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  bottleSize?: string
  storeId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Debt {
  id: string
  customerName: string
  customerPhone?: string
  amount: number
  status: "pending" | "paid"
  date: string
  note?: string
  storeId?: string
  paidAt?: string
  createdAt?: string
}

export interface Sale {
  id: string
  productId: string
  productName: string
  quantity: number
  total: number
  paid: boolean
  date: string
  customerId?: string
  storeId?: string
  createdAt?: string
}

export interface Store {
  id: string
  name: string
  ownerPhone: string
  pin?: string
  logoUrl?: string
  primaryColor: string
  secondaryColor?: string
  createdAt?: string
  updatedAt?: string
}

export interface StoreColors {
  primary: string
  secondary?: string
}
