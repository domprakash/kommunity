import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple'

interface BadgeProps { children: ReactNode; variant?: BadgeVariant; className?: string }

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-blue-50 text-blue-700 border-blue-100',
  success: 'bg-green-50 text-green-700 border-green-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger:  'bg-red-50 text-red-600 border-red-100',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-100',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border', variantClasses[variant], className)}>
      {children}
    </span>
  )
}
