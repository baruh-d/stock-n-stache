import { AlertTriangle, RefreshCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorAlertProps {
  title?: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function ErrorAlert({
  title = "Something went wrong",
  message,
  onRetry,
  onDismiss,
  className,
}: ErrorAlertProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-destructive/30 bg-destructive/10 p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-destructive">{title}</h3>
          <p className="mt-1 text-sm text-destructive/80">{message}</p>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-2">
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function InlineError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-sm text-destructive">
      <AlertTriangle className="h-3.5 w-3.5" />
      {message}
    </p>
  )
}
