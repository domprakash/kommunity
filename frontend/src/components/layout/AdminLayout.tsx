import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Megaphone, DollarSign, MessageSquare, BarChart3, ShoppingBag, FileText, Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/authService'
import toast from 'react-hot-toast'

const navItems = [
  { path:'/admin',             icon:LayoutDashboard, label:'Overview',    exact:true  },
  { path:'/admin/residents',   icon:Users,           label:'Residents',   exact:false },
  { path:'/admin/notices',     icon:Megaphone,       label:'Notices',     exact:false },
  { path:'/admin/finance',     icon:DollarSign,      label:'Finance',     exact:false },
  { path:'/admin/complaints',  icon:MessageSquare,   label:'Complaints',  exact:false },
  { path:'/admin/polls',       icon:BarChart3,       label:'Polls',       exact:false },
  { path:'/admin/marketplace', icon:ShoppingBag,     label:'Marketplace', exact:false },
  { path:'/admin/reports',     icon:FileText,        label:'Reports',     exact:false },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const handleLogout = async () => { await logout(); toast.success('Signed out'); navigate('/login') }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"><span className="text-white text-sm font-bold">K</span></div>
          <div><p className="text-sm font-semibold text-foreground">Kommunity</p><p className="text-xs text-muted-foreground">Admin Panel</p></div>
        </div>
        {onClose && <button onClick={onClose} className="text-muted-foreground lg:hidden"><X className="w-5 h-5" /></button>}
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-muted-foreground font-semibold px-3 py-2 uppercase tracking-wider">Modules</p>
        {navItems.map(({ path, icon:Icon, label, exact }) => (
          <NavLink key={path} to={path} end={exact} onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-muted font-medium'}`}
          >
            {({ isActive }) => (<><Icon className="w-4 h-4 shrink-0" /><span className="flex-1">{label}</span>{isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}</>)}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.communityName}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="app-shell flex">
      <aside className="hidden lg:block w-60 bg-card border-r border-border shrink-0 h-full"><SidebarContent /></aside>
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div key="overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setDrawerOpen(false)} />
            <motion.aside key="drawer" initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }} transition={{ type:'spring', stiffness:300, damping:30 }} className="fixed inset-y-0 left-0 w-72 bg-card z-50 lg:hidden">
              <SidebarContent onClose={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><Menu className="w-5 h-5 text-foreground" /></button>
          <span className="font-semibold text-foreground">Admin Dashboard</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 scrollbar-hide"><Outlet /></main>
      </div>
    </div>
  )
}
