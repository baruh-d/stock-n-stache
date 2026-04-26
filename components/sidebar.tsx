"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BookOpen,
  Settings,
  Menu,
  X,
  Wine,
  BarChart3,
  Truck,
  Users,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store-context"
import { ComingSoonBadge } from "./coming-soon-badge"
import { ThemeToggle } from "./theme-toggle"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  comingSoon?: boolean
}

const mainNavigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Debt Book", href: "/debts", icon: BookOpen },
  { name: "Reports", href: "/reports", icon: BarChart3, comingSoon: true },
  { name: "Suppliers", href: "/suppliers", icon: Truck, comingSoon: true },
]

const secondaryNavigation: NavItem[] = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Team", href: "/settings/team", icon: Users, comingSoon: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { storeName } = useStore()
  const { logout } = useAuth()

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-primary"
            : item.comingSoon
              ? "text-sidebar-foreground/40 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/60"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        <item.icon className={cn("h-5 w-5", item.comingSoon && "opacity-50")} />
        <span className="flex-1">{item.name}</span>
        {item.comingSoon && <ComingSoonBadge />}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-card p-2 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-sidebar-foreground/70 hover:text-sidebar-foreground lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo and store info */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Wine className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">BarLedger</span>
            <span className="text-xs text-sidebar-foreground/60">{storeName}</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
            Main
          </div>
          {mainNavigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}

          <div className="mb-2 mt-6 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
            Settings
          </div>
          {secondaryNavigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="border-t border-sidebar-border px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sidebar-foreground/60">Theme</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                {storeName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{storeName}</span>
                <span className="text-xs text-sidebar-foreground/60">Store Owner</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
