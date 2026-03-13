import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Users, ShoppingBag, Briefcase, User, Bell, Search } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'

const tabs = [
  { path:'/resident',             icon:Home,       label:'Home',      exact:true  },
  { path:'/resident/community',   icon:Users,      label:'Community', exact:false },
  { path:'/resident/marketplace', icon:ShoppingBag,label:'Market',    exact:false },
  { path:'/resident/services',    icon:Briefcase,  label:'Services',  exact:false },
  { path:'/resident/profile',     icon:User,       label:'Profile',   exact:false },
]

export function ResidentLayout() {
  const navigate    = useNavigate()
  const { user }    = useAuthStore()
  const unreadCount = useDataStore((s) => s.unreadCount)

  return (
    <div className="app-shell flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <span className="text-foreground font-semibold text-[1.05rem]">Kommunity</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/resident/search')} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-slate-200 transition-colors" aria-label="Search">
            <Search className="w-[17px] h-[17px] text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/resident/notifications')} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center relative hover:bg-slate-200 transition-colors" aria-label="Notifications">
            <Bell className="w-[17px] h-[17px] text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/resident/profile')} className="w-9 h-9 rounded-full overflow-hidden border-2 border-border" aria-label="Profile">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
            }
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.18 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-1 py-1 flex justify-around items-center safe-bottom shadow-mobile">
        {tabs.map(({ path, icon:Icon, label, exact }) => (
          <NavLink key={path} to={path} end={exact}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-normal'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
