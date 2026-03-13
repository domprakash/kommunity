import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode; hoverable?: boolean; padding?: 'none'|'sm'|'md'|'lg'
}
const paddingClasses = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' }

export function Card({ children, hoverable, padding = 'md', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-border shadow-card',
        hoverable && 'transition-shadow hover:shadow-card-hover cursor-pointer active:opacity-90',
        paddingClasses[padding], className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
