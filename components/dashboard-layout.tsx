"use client"

import { AppShell } from "./app-shell"
import { Sidebar } from "./sidebar"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-6xl pt-12 lg:pt-0">{children}</div>
          </div>
        </main>
      </div>
    </AppShell>
  )
}
