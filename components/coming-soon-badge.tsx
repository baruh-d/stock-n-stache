import { cn } from "@/lib/utils"

interface ComingSoonBadgeProps {
  className?: string
  size?: "sm" | "md"
}

export function ComingSoonBadge({ className, size = "sm" }: ComingSoonBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary/20 font-medium text-primary",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className
      )}
    >
      Soon
    </span>
  )
}
