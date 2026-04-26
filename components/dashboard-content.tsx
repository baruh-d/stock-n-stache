"use client"

import { DollarSign, TrendingDown, AlertTriangle, Package, Plus, BookOpen, ArrowUpRight, Clock } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardContent() {
  const { products, debts, sales, storeName } = useStore()

  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const outstandingDebt = debts.filter((d) => d.status === "pending").reduce((sum, d) => sum + d.amount, 0)
  const pendingDebts = debts.filter((d) => d.status === "pending")
  const lowStockItems = products.filter((p) => p.quantity < 5)
  const todaysSales = sales
    .filter((s) => s.date === new Date().toISOString().split("T")[0])
    .reduce((sum, s) => sum + s.total, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `KES ${(amount / 1000).toFixed(0)}K`
    }
    return formatCurrency(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{storeName}</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/sales">
              <Plus className="mr-1.5 h-4 w-4" />
              New Sale
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/inventory">
              <Package className="mr-1.5 h-4 w-4" />
              Inventory
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid - Bento style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stock Value - Featured */}
        <div className="sm:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Stock Value</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground">
                {formatCompactCurrency(totalStockValue)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {products.length} products in inventory
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-primary">
              <ArrowUpRight className="h-4 w-4" />
              {formatCurrency(todaysSales)}
            </span>
            <span className="text-muted-foreground">sold today</span>
          </div>
        </div>

        {/* Outstanding Debts */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-foreground">
            {formatCompactCurrency(outstandingDebt)}
          </p>
          <Link href="/debts" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            {pendingDebts.length} pending
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              lowStockItems.length > 0 ? "bg-primary/10" : "bg-success/10"
            )}>
              <AlertTriangle className={cn(
                "h-4 w-4",
                lowStockItems.length > 0 ? "text-primary" : "text-success"
              )} />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-foreground">
            {lowStockItems.length}
          </p>
          <Link href="/inventory" className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            Need restock
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Low Stock Alert */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-card-foreground">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Low Stock Alert
            </h2>
            <Link href="/inventory" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {lowStockItems.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                    <Package className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                  {product.quantity} left
                </span>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <div className="px-5 py-8 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">All products well stocked</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Debts */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-card-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Recent Debts
            </h2>
            <Link href="/debts" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {pendingDebts.slice(0, 4).map((debt) => (
              <div key={debt.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {debt.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{debt.customerName}</p>
                    <p className="text-xs text-muted-foreground">{debt.note || debt.date}</p>
                  </div>
                </div>
                <span className="font-display text-sm font-semibold text-primary">
                  {formatCurrency(debt.amount)}
                </span>
              </div>
            ))}
            {pendingDebts.length === 0 && (
              <div className="px-5 py-8 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <BookOpen className="h-5 w-5 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">No pending debts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/sales"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-card-foreground">Record Sale</p>
            <p className="text-sm text-muted-foreground">Log a new transaction</p>
          </div>
        </Link>
        <Link
          href="/debts"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-card-foreground">Add Debt</p>
            <p className="text-sm text-muted-foreground">Record credit sale</p>
          </div>
        </Link>
        <Link
          href="/inventory"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-card-foreground">Add Product</p>
            <p className="text-sm text-muted-foreground">Update inventory</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
