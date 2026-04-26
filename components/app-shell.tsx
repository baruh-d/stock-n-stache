"use client"

import { useAuth } from "@/lib/auth-context"
import { StoreProvider } from "@/lib/store-context"
import { PinLogin } from "./pin-login"
import { LoadingSpinner } from "./loading-spinner"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <PinLogin />
  }

  return <StoreProvider>{children}</StoreProvider>
}
