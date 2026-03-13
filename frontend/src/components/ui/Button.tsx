import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
type Size    = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size; isLoading?: boolean; leftIcon?: ReactNode; rightIcon?: ReactNode; children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:     'bg-primary text-primary-foreground hover:bg-primary-700 shadow-sm active:scale-[0.98]',
  secondary:   'bg-secondary text-secondary-foreground hover:bg-slate-200 border border-border',
  ghost:       'text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-white hover:bg-red-600',
  outline:     'border border-border text-foreground hover:bg-muted bg-transparent',
}

const sizeClasses: Record<Size, string> = {
  sm:   'h-8  px-3   text-xs  gap-1.5',
  md:   'h-10 px-4   text-sm  gap-2',
  lg:   'h-12 px-5   text-base gap-2',
  icon: 'h-10 w-10  text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        variantClasses[variant], sizeClasses[size], className,
      )}
      {...props}
    >
      {isLoading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  ),
)
Button.displayName = 'Button'
