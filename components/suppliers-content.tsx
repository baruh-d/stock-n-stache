"use client"

import { Truck, ClipboardList, Phone, RotateCcw } from "lucide-react"

export function SuppliersContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Suppliers</h1>
        <p className="mt-1 text-muted-foreground">Manage your supplier contacts and orders</p>
      </div>

      {/* Coming Soon Card */}
      <div className="rounded-xl border border-border bg-card p-8 sm:p-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-card-foreground sm:text-2xl">
            Purchase Orders Coming in Phase 3
          </h2>
          <p className="mt-3 text-muted-foreground">
            Track supplier contacts, order history, and set up auto-reordering. Never run out of your best sellers.
          </p>
          
          {/* Preview Features */}
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Phone className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Supplier Contacts</p>
              <p className="text-sm text-muted-foreground">All your vendors in one place</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <ClipboardList className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Order History</p>
              <p className="text-sm text-muted-foreground">Track past purchases easily</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <RotateCcw className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Auto-Reorder</p>
              <p className="text-sm text-muted-foreground">Set minimum stock levels</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Truck className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Delivery Tracking</p>
              <p className="text-sm text-muted-foreground">Know when stock arrives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
