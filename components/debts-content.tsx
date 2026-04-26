"use client"

import { useState, useMemo } from "react"
import { Plus, Check, Search, Phone, X, ArrowUpDown, Loader2 } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function DebtsContent() {
  const { debts, addDebt, markDebtAsPaid } = useStore()
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [showPaid, setShowPaid] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [stkDialog, setStkDialog] = useState<{ id: string; name: string; amount: number } | null>(null)
  const [stkStatus, setStkStatus] = useState<"idle" | "pending" | "success">("idle")
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    amount: "",
    note: "",
  })

  const pendingDebts = debts.filter((d) => d.status === "pending")
  const paidDebts = debts.filter((d) => d.status === "paid")
  const displayDebts = showPaid ? paidDebts : pendingDebts

  const filteredDebts = useMemo(() => {
    let filtered = displayDebts.filter(
      (d) =>
        d.customerName.toLowerCase().includes(search.toLowerCase()) ||
        (d.note && d.note.toLowerCase().includes(search.toLowerCase()))
    )
    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "amount") {
        return b.amount - a.amount
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    return filtered
  }, [displayDebts, search, sortBy])

  const totalOutstanding = pendingDebts.reduce((sum, d) => sum + d.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addDebt({
      customerName: form.customerName,
      customerPhone: form.customerPhone || undefined,
      amount: Number(form.amount),
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      note: form.note || undefined,
    })
    setForm({ customerName: "", customerPhone: "", amount: "", note: "" })
    setIsAddOpen(false)
  }

  const handleMarkPaid = (id: string) => {
    markDebtAsPaid(id)
  }

  const handleStkPush = async () => {
    if (!stkDialog) return
    setStkStatus("pending")
    // Simulate M-Pesa STK push
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStkStatus("success")
    // Auto mark as paid after success
    setTimeout(() => {
      markDebtAsPaid(stkDialog.id)
      setStkDialog(null)
      setStkStatus("idle")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Debt Book
          </h1>
          <p className="mt-1 text-muted-foreground">
            {pendingDebts.length} pending · Outstanding:{" "}
            <span className="font-semibold text-primary">{formatCurrency(totalOutstanding)}</span>
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Record Debt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Debt</DialogTitle>
              <DialogDescription>Add a new debt entry when a customer takes goods on credit.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Customer Name</label>
                <Input
                  placeholder="e.g. John Kamau"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number (Optional)</label>
                <Input
                  placeholder="e.g. 0712 345 678"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount (KES)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Note (Optional)</label>
                <Input
                  placeholder="e.g. 2x Smirnoff bottles"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Debt</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setShowPaid(false)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                !showPaid ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pending ({pendingDebts.length})
            </button>
            <button
              onClick={() => setShowPaid(true)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                showPaid ? "bg-success text-success-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Paid ({paidDebts.length})
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortBy(sortBy === "date" ? "amount" : "date")}
            title={`Sort by ${sortBy === "date" ? "amount" : "date"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Debt List */}
      <div className="space-y-3">
        {filteredDebts.map((debt) => (
          <div
            key={debt.id}
            className={cn(
              "rounded-xl border border-border bg-card p-4 transition-all",
              debt.status === "paid" && "opacity-60"
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
                    debt.status === "paid"
                      ? "bg-success/10 text-success"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {debt.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-card-foreground">{debt.customerName}</p>
                    {debt.customerPhone && (
                      <span className="text-sm text-muted-foreground">{debt.customerPhone}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{debt.date}</p>
                  {debt.note && (
                    <p className="mt-1 text-sm text-muted-foreground truncate">{debt.note}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={cn(
                      "font-display text-xl font-bold",
                      debt.status === "paid" ? "text-success" : "text-primary"
                    )}
                  >
                    {formatCurrency(debt.amount)}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      debt.status === "paid"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {debt.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
                {debt.status === "pending" && (
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-2">
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setStkDialog({ id: debt.id, name: debt.customerName, amount: debt.amount })}
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Request
                        </Button>
                        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500"></span>
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="gap-1.5 bg-success text-success-foreground hover:bg-success/90"
                        onClick={() => handleMarkPaid(debt.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Paid
                      </Button>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-sky-400">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                      M-Pesa STK coming soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredDebts.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <div className={cn(
              "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
              showPaid ? "bg-success/10" : "bg-primary/10"
            )}>
              {showPaid ? (
                <Check className="h-6 w-6 text-success" />
              ) : (
                <Search className="h-6 w-6 text-primary" />
              )}
            </div>
            <p className="font-medium text-card-foreground">
              {search ? "No debts match your search" : showPaid ? "No paid debts yet" : "No pending debts"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try a different search term"
                : showPaid
                ? "Paid debts will appear here"
                : "Record a debt when customers buy on credit"}
            </p>
          </div>
        )}
      </div>

      {/* STK Push Simulation Dialog */}
      <Dialog open={!!stkDialog} onOpenChange={() => { setStkDialog(null); setStkStatus("idle"); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>M-Pesa Payment Request</DialogTitle>
            <DialogDescription>
              Send an M-Pesa STK push to {stkDialog?.name} for {stkDialog && formatCurrency(stkDialog.amount)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {stkStatus === "idle" && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  The customer will receive an M-Pesa prompt on their phone to confirm the payment.
                </p>
              </div>
            )}
            {stkStatus === "pending" && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="font-medium text-foreground">Waiting for payment...</p>
                <p className="text-sm text-muted-foreground">
                  STK push sent. Waiting for {stkDialog?.name} to confirm.
                </p>
              </div>
            )}
            {stkStatus === "success" && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <p className="font-medium text-success">Payment Received!</p>
                <p className="text-sm text-muted-foreground">
                  {stkDialog && formatCurrency(stkDialog.amount)} from {stkDialog?.name}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            {stkStatus === "idle" && (
              <>
                <Button variant="outline" onClick={() => setStkDialog(null)}>
                  Cancel
                </Button>
                <Button onClick={handleStkPush}>
                  <Phone className="mr-2 h-4 w-4" />
                  Send STK Push
                </Button>
              </>
            )}
            {stkStatus === "pending" && (
              <Button variant="outline" onClick={() => { setStkDialog(null); setStkStatus("idle"); }}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
