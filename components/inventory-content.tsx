"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Trash2, Edit2, Package, Filter, X } from "lucide-react"
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

export function InventoryContent() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "ok">("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    bottleSize: "",
  })

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))]
    return cats.sort()
  }, [products])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && p.quantity < 5) ||
        (stockFilter === "ok" && p.quantity >= 5)
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, search, categoryFilter, stockFilter])

  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const lowStockCount = products.filter((p) => p.quantity < 5).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      updateProduct(editingProduct, {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        bottleSize: form.bottleSize || undefined,
      })
      setEditingProduct(null)
    } else {
      addProduct({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        bottleSize: form.bottleSize || undefined,
      })
    }
    setForm({ name: "", category: "", price: "", quantity: "", bottleSize: "" })
    setIsAddOpen(false)
  }

  const handleEdit = (product: (typeof products)[0]) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      bottleSize: product.bottleSize || "",
    })
    setEditingProduct(product.id)
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setDeleteConfirm(null)
  }

  const clearFilters = () => {
    setSearch("")
    setCategoryFilter("all")
    setStockFilter("all")
  }

  const hasActiveFilters = search || categoryFilter !== "all" || stockFilter !== "all"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 text-muted-foreground">
            {products.length} products · {lowStockCount > 0 && (
              <span className="text-destructive">{lowStockCount} low stock</span>
            )}
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              onClick={() => {
                setEditingProduct(null)
                setForm({ name: "", category: "", price: "", quantity: "", bottleSize: "" })
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update the product details below." : "Enter the details of the new product."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Name</label>
                <Input
                  placeholder="e.g. Johnnie Walker Black"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Input
                  placeholder="e.g. Whisky, Vodka, Beer"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price (KES)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Quantity</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bottle Size (Optional)</label>
                <Input
                  placeholder="e.g. 750ml"
                  value={form.bottleSize}
                  onChange={(e) => setForm({ ...form, bottleSize: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingProduct ? "Update" : "Add Product"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-border">
            <button
              onClick={() => setStockFilter("all")}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                stockFilter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter("low")}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                stockFilter === "low" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Low
            </button>
            <button
              onClick={() => setStockFilter("ok")}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                stockFilter === "ok" ? "bg-success text-success-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm font-medium text-foreground">{formatCurrency(totalValue)} total</span>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto h-7 text-xs">
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        </div>
      )}

      {/* Product Cards - Mobile friendly grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={cn(
              "rounded-xl border border-border bg-card p-4",
              product.quantity < 5 && "border-destructive/50 bg-destructive/5"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  product.quantity < 5 ? "bg-destructive/10" : "bg-muted"
                )}>
                  <Package className={cn(
                    "h-5 w-5",
                    product.quantity < 5 ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} {product.bottleSize && `· ${product.bottleSize}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteConfirm(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-lg font-semibold text-card-foreground">{formatCurrency(product.price)}</p>
                <p className="text-xs text-muted-foreground">per unit</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold",
                    product.quantity < 5
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success/10 text-success"
                  )}
                >
                  {product.quantity} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table - Desktop */}
      <div className="hidden rounded-xl border border-border bg-card overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stock
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Value
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={cn(
                    "transition-colors hover:bg-muted/20",
                    product.quantity < 5 && "bg-destructive/5"
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        product.quantity < 5 ? "bg-destructive/10" : "bg-muted"
                      )}>
                        <Package className={cn(
                          "h-4 w-4",
                          product.quantity < 5 ? "text-destructive" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{product.name}</p>
                        {product.bottleSize && (
                          <p className="text-xs text-muted-foreground">{product.bottleSize}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-card-foreground">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={cn(
                        "inline-flex min-w-[3rem] items-center justify-center rounded-full px-2.5 py-1 text-sm font-semibold",
                        product.quantity < 5
                          ? "bg-destructive/10 text-destructive"
                          : "bg-success/10 text-success"
                      )}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-card-foreground">
                    {formatCurrency(product.price * product.quantity)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="px-5 py-12 text-center text-muted-foreground">
            {hasActiveFilters ? "No products match your filters" : "No products in inventory"}
          </div>
        )}
      </div>

      {/* Mobile empty state */}
      {filteredProducts.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-5 py-12 text-center lg:hidden">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            {hasActiveFilters ? "No products match your filters" : "No products in inventory"}
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
