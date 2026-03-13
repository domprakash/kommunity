import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string }

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div key="dialog"
            initial={{ y:'100%', opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:'100%', opacity:0 }}
            transition={{ type:'spring', stiffness:300, damping:30 }}
            className={cn('fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-card rounded-t-3xl shadow-2xl max-h-[90dvh] flex flex-col', className)}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
