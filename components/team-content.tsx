"use client"

import { Users, Shield, UserPlus, Key } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TeamContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/settings" className="text-muted-foreground hover:text-foreground">
          Settings
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground">Team</span>
      </div>
      
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Team Management</h1>
        <p className="mt-1 text-muted-foreground">Manage staff access and permissions</p>
      </div>

      {/* Coming Soon Card */}
      <div className="rounded-xl border border-border bg-card p-8 sm:p-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-card-foreground sm:text-2xl">
            Staff Access Controls Coming in Phase 4
          </h2>
          <p className="mt-3 text-muted-foreground">
            Add cashiers, managers, or owners with different permissions. Control who can access inventory, sales, and financial data.
          </p>
          
          {/* Preview Features */}
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <UserPlus className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Add Staff</p>
              <p className="text-sm text-muted-foreground">Invite team via phone or email</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Shield className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Role-Based Access</p>
              <p className="text-sm text-muted-foreground">Cashier, Manager, Owner roles</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Key className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Permissions</p>
              <p className="text-sm text-muted-foreground">Fine-grained feature access</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Users className="mb-2 h-5 w-5 text-primary" />
              <p className="font-medium text-card-foreground">Activity Log</p>
              <p className="text-sm text-muted-foreground">Track who did what</p>
            </div>
          </div>

          <Button variant="outline" asChild className="mt-8">
            <Link href="/settings">Back to Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
