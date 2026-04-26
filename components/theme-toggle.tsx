"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-1 rounded-lg bg-muted/50 p-1", className)}>
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ]

  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-muted/50 p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            theme === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={option.label}
        >
          <option.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}

export function ThemeToggleExpanded({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("grid grid-cols-3 gap-3", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  const options = [
    { value: "light", icon: Sun, label: "Light", description: "Always light" },
    { value: "dark", icon: Moon, label: "Dark", description: "Always dark" },
    { value: "system", icon: Monitor, label: "System", description: "Match device" },
  ]

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
            theme === option.value
              ? "border-primary bg-primary/5"
              : "border-transparent bg-muted/30 hover:bg-muted/50"
          )}
        >
          <option.icon
            className={cn(
              "h-6 w-6",
              theme === option.value ? "text-primary" : "text-muted-foreground"
            )}
          />
          <div className="text-center">
            <p className="text-sm font-medium">{option.label}</p>
            <p className="text-xs text-muted-foreground">{option.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
