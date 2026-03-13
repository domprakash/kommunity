import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; leftIcon?: ReactNode; rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}
        <div className="relative">
          {leftIcon  && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{leftIcon}</span>}
          <input
            ref={ref} id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
              error ? 'border-destructive' : 'border-border',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{rightIcon}</span>}
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
