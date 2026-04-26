"use client"

import { useState } from "react"
import { Save, Upload, LogOut, Store, Palette, Users, ChevronRight, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { ComingSoonBadge } from "./coming-soon-badge"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ThemeToggleExpanded } from "./theme-toggle"
import { useAuth } from "@/lib/auth-context"

export function SettingsContent() {
  const { store, updateStore } = useStore()
  const { logout } = useAuth()
  const [form, setForm] = useState({
    name: store.name,
    ownerPhone: store.ownerPhone,
    primaryColor: store.primaryColor,
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateStore({
      name: form.name,
      ownerPhone: form.ownerPhone,
      primaryColor: form.primaryColor,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const colorPresets = [
    { name: "Amber", value: "#f59e0b" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Purple", value: "#a855f7" },
    { name: "Red", value: "#ef4444" },
    { name: "Teal", value: "#14b8a6" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Settings Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Accordion type="single" collapsible defaultValue="store-info">
            <AccordionItem value="store-info" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-medium text-card-foreground">Store Information</h2>
                    <p className="text-sm text-muted-foreground">Name, contact details</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Store Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Owner Phone Number</label>
                    <Input
                      value={form.ownerPhone}
                      onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {saved ? "Saved!" : "Save Changes"}
                  </Button>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Branding Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Accordion type="single" collapsible defaultValue="branding">
            <AccordionItem value="branding" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-medium text-card-foreground">Branding</h2>
                    <p className="text-sm text-muted-foreground">Logo, colors</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {/* Logo Upload */}
                <div className="mb-6 space-y-3">
                  <label className="text-sm font-medium text-foreground">Store Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt="Store logo"
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-muted-foreground">
                          {store.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PNG or JPG, max 2MB. Logo will appear in reports and receipts.
                  </p>
                </div>

                {/* Brand Color */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Brand Color</label>
                  <div className="flex flex-wrap gap-3">
                    {colorPresets.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setForm({ ...form, primaryColor: color.value })}
                        className="group relative"
                      >
                        <div
                          className="h-10 w-10 rounded-full transition-transform hover:scale-110"
                          style={{ backgroundColor: color.value }}
                        />
                        {form.primaryColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      className="h-10 w-16 cursor-pointer p-1"
                    />
                    <Input
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Appearance Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Accordion type="single" collapsible defaultValue="appearance">
            <AccordionItem value="appearance" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Sun className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-medium text-card-foreground">Appearance</h2>
                    <p className="text-sm text-muted-foreground">Theme preferences</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Color Theme</label>
                  <ThemeToggleExpanded />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Team Management Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <Link
            href="/settings/team"
            className="flex items-center justify-between rounded-lg p-4 -m-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-card-foreground">Team Management</p>
                  <ComingSoonBadge />
                </div>
                <p className="text-sm text-muted-foreground">
                  Add staff members and manage permissions
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>

        {/* Account Actions */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-medium text-card-foreground">Account</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-card-foreground">Sign out of BarLedger</p>
              <p className="text-sm text-muted-foreground">
                You&apos;ll need to sign in again to access your store data.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
