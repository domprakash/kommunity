import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

interface TrustScoreProps { score: number; size?: 'sm'|'md'; className?: string }

export function TrustScore({ score, size = 'sm', className }: TrustScoreProps) {
  const color =
    score >= 75 ? 'text-green-600 bg-green-50 border-green-100' :
    score >= 50 ? 'text-amber-600 bg-amber-50 border-amber-100' :
                  'text-red-500 bg-red-50 border-red-100'
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold', color, size === 'md' ? 'text-sm' : 'text-xs', className)}>
      <Star className={size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} fill="currentColor" />
      {score}
    </span>
  )
}
