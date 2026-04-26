"use client"

import { useState, useMemo } from "react"
import { ShoppingCart, Check, CreditCard, Search, Package, Building2, CheckCircle2 } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function SalesContent() {
  const { products, sales, addSale, addDebt } = useStore()
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [paid, setPaid] = useState(true)
  const [customerName, setCustomerName] = useState("")

  const selectedProductData = products.find((p) => p.id === selectedProduct)
  const total = selectedProductData ? selectedProductData.price * Number(quantity) : 0

  // Filter products for quick select
  const filteredProducts = useMemo(() => {
    if (!search) return products.filter((p) => p.quantity > 0).slice(0, 6)
    return products
      .filter(
        (p) =>
          p.quantity > 0 &&
          (p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase()))
      )
      .slice(0, 6)
  }, [products, search])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductData) return

    addSale({
      productId: selectedProductData.id,
      productName: selectedProductData.name,
      quantity: Number(quantity),
      total,
      paid,
      date: new Date().toISOString().split("T")[0],
    })

    // If not paid, also add to debts with customer name
    if (!paid && customerName) {
      addDebt({
        customerName: customerName,
        amount: total,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        note: `${quantity}x ${selectedProductData.name}`,
      })
    }

    // Reset form
    setSelectedProduct("")
    setQuantity("1")
    setPaid(true)
    setCustomerName("")
    setSearch("")
  }

  const handleQuickSelect = (productId: string) => {
    setSelectedProduct(productId)
    setSearch("")
  }

  const todaysSales = sales.filter((s) => s.date === new Date().toISOString().split("T")[0])
  const todaysTotal = todaysSales.reduce((sum, s) => sum + s.total, 0)
  const todaysPaid = todaysSales.filter((s) => s.paid).reduce((sum, s) => sum + s.total, 0)
  const todaysCredit = todaysTotal - todaysPaid

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Record Sale
        </h1>
        <p className="mt-1 text-muted-foreground">Log a new sale transaction</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Sale Form */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Search */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Select Product</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Quick Select Grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleQuickSelect(product.id)}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                      selectedProduct === product.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground truncate">
                        {product.name}
                      </span>
                      {selectedProduct === product.id && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                    <div className="mt-1 flex w-full items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      <span className={cn(
                        "text-xs",
                        product.quantity < 5 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {product.quantity} left
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {search ? "No products match your search" : "No products in stock"}
                  </p>
                </div>
              )}
            </div>

            {/* Selected Product Details */}
            {selectedProductData && (
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-card-foreground">{selectedProductData.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProductData.category} {selectedProductData.bottleSize && `· ${selectedProductData.bottleSize}`}
                    </p>
                  </div>
                  <p className="font-display text-lg font-bold text-primary">
                    {formatCurrency(selectedProductData.price)}
                  </p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, Number(quantity) - 1).toString())}
                  disabled={Number(quantity) <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={selectedProductData?.quantity || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-20 text-center"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(
                      Math.min(selectedProductData?.quantity || 1, Number(quantity) + 1).toString()
                    )
                  }
                  disabled={Number(quantity) >= (selectedProductData?.quantity || 1)}
                >
                  +
                </Button>
                {selectedProductData && (
                  <span className="text-sm text-muted-foreground">
                    Max: {selectedProductData.quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Payment Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Payment Status</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaid(true)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all",
                    paid
                      ? "border-success bg-success/10 text-success"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  )}
                >
                  <Check className="h-5 w-5" />
                  Cash / Paid
                </button>
                <button
                  type="button"
                  onClick={() => setPaid(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all",
                    !paid
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  )}
                >
                  <CreditCard className="h-5 w-5" />
                  On Credit
                </button>
              </div>
            </div>

            {/* Customer Name (if on credit) */}
            {!paid && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Customer Name</label>
                <Input
                  placeholder="Enter customer name for debt record"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required={!paid}
                />
              </div>
            )}

            {/* Total & Submit */}
            <div className="space-y-4 border-t border-border pt-4">
              {selectedProductData && (
                <div className="flex items-center justify-between">
                  <span className="text-lg text-muted-foreground">Total Amount</span>
                  <span className="font-display text-3xl font-bold text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!selectedProduct || (!paid && !customerName)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {paid ? "Record Sale" : "Record Credit Sale"}
              </Button>
            </div>
          </form>
        </div>

        {/* Today's Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Today&apos;s Sales</p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                {formatCurrency(todaysTotal)}
              </p>
              <p className="text-xs text-muted-foreground">{todaysSales.length} transactions</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Cash Received</p>
              <p className="mt-1 font-display text-2xl font-bold text-success">
                {formatCurrency(todaysPaid)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">On Credit</p>
              <p className="mt-1 font-display text-2xl font-bold text-destructive">
                {formatCurrency(todaysCredit)}
              </p>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-display text-sm font-semibold text-card-foreground">Recent Sales</h2>
            </div>
            <div className="divide-y divide-border">
              {todaysSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">{sale.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {sale.quantity}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold text-card-foreground">{formatCurrency(sale.total)}</p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        sale.paid ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {sale.paid ? "Paid" : "Credit"}
                    </span>
                  </div>
                </div>
              ))}
              {todaysSales.length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm">No sales recorded today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
