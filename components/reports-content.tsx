"use client"

import { BarChart3, TrendingUp, Package, Calendar } from "lucide-react"

export function ReportsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Reports</h1>
        <p className="mt-1 text-muted-foreground">Sales analytics and business insights</p>
      </div>

      {/* Coming Soon Card */}
      <div className="rounded-xl border border-border bg-card p-8 sm:p-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-card-foreground sm:text-2xl">
            Sales Analytics Coming in Phase 2
          </h2>
          <p className="mt-3 text-muted-foreground">
            Track best-selling products, revenue patterns, and low stock forecasts. Get actionable insights to grow your business.
          </p>
          
          {/* Preview Features */}
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <TrendingUp className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Revenue Trends</p>
              <p className="text-sm text-muted-foreground">Daily, weekly, and monthly charts</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Package className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Top Products</p>
              <p className="text-sm text-muted-foreground">Best sellers and slow movers</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Calendar className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Sales Calendar</p>
              <p className="text-sm text-muted-foreground">Peak hours and busy days</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <BarChart3 className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Stock Forecasts</p>
              <p className="text-sm text-muted-foreground">Predict when to reorder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
