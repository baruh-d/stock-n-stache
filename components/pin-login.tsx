"use client"

import { useState } from "react"
import { Wine, Delete, ArrowRight, Store } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PinLogin() {
  const { login, availableStores } = useAuth()
  const [selectedStore, setSelectedStore] = useState<string>("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"store" | "pin">("store")

  const handlePinPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit
      setPin(newPin)
      setError("")
      
      // Auto-submit when 4 digits entered
      if (newPin.length === 4) {
        const success = login(selectedStore, newPin)
        if (!success) {
          setError("Incorrect PIN. Try again.")
          setTimeout(() => setPin(""), 300)
        }
      }
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
    setError("")
  }

  const handleStoreSelect = (storeId: string) => {
    setSelectedStore(storeId)
    setStep("pin")
    setPin("")
    setError("")
  }

  const handleBack = () => {
    setStep("store")
    setSelectedStore("")
    setPin("")
    setError("")
  }

  const selectedStoreName = availableStores.find((s) => s.id === selectedStore)?.name

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Wine className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            BarLedger
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "store" ? "Select your store to continue" : `Enter PIN for ${selectedStoreName}`}
          </p>
        </div>

        {step === "store" ? (
          /* Store Selection */
          <div className="space-y-3">
            {availableStores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store.id)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-card-foreground">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.ownerPhone}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
            <p className="pt-4 text-center text-xs text-muted-foreground">
              Demo PINs: 1234, 5678, or 0000
            </p>
          </div>
        ) : (
          /* PIN Entry */
          <div className="space-y-6">
            {/* PIN Display */}
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl border-2 text-2xl font-bold transition-all",
                    pin.length > i
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-transparent",
                    error && "border-destructive animate-shake"
                  )}
                >
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-center text-sm font-medium text-destructive">{error}</p>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handlePinPress(digit)}
                  className="flex h-16 items-center justify-center rounded-xl bg-card text-2xl font-semibold text-card-foreground transition-all hover:bg-muted active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleBack}
                className="flex h-16 items-center justify-center rounded-xl bg-card text-sm font-medium text-muted-foreground transition-all hover:bg-muted active:scale-95"
              >
                Back
              </button>
              <button
                onClick={() => handlePinPress("0")}
                className="flex h-16 items-center justify-center rounded-xl bg-card text-2xl font-semibold text-card-foreground transition-all hover:bg-muted active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="flex h-16 items-center justify-center rounded-xl bg-card text-card-foreground transition-all hover:bg-muted active:scale-95"
              >
                <Delete className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
