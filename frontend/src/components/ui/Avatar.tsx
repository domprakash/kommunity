import { cn } from '@/utils/cn'
import { initials } from '@/utils/formatters'

type AvatarSize = 'xs'|'sm'|'md'|'lg'|'xl'
interface AvatarProps { src?: string; name?: string; size?: AvatarSize; className?: string }

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6  h-6  text-[10px]', sm: 'w-8  h-8  text-xs',
  md: 'w-10 h-10 text-sm',     lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl',
}

export function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  if (src) return <img src={src} alt={name} className={cn('rounded-full object-cover', sizeClasses[size], className)} />
  return (
    <div className={cn('rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center select-none', sizeClasses[size], className)}>
      {initials(name)}
    </div>
  )
}
