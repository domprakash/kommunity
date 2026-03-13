import { Outlet, NavLink } from 'react-router-dom'
import { Calendar, DollarSign, Star, User, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  { path:'/partner',           icon:BarChart3,  label:'Overview', exact:true  },
  { path:'/partner/bookings',  icon:Calendar,   label:'Bookings', exact:false },
  { path:'/partner/earnings',  icon:DollarSign, label:'Earnings', exact:false },
  { path:'/partner/reviews',   icon:Star,       label:'Reviews',  exact:false },
  { path:'/partner/profile',   icon:User,       label:'Profile',  exact:false },
]

export function PartnerLayout() {
  return (
    <div className="app-shell flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center"><span className="text-white text-sm font-bold">K</span></div>
          <div><p className="text-sm font-semibold text-foreground">Kommunity</p><p className="text-xs text-muted-foreground">Partner Portal</p></div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.18 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-1 py-1 flex justify-around items-center safe-bottom">
        {tabs.map(({ path, icon:Icon, label, exact }) => (
          <NavLink key={path} to={path} end={exact}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors ${isActive ? 'text-accent' : 'text-muted-foreground'}`}
          >
            {({ isActive }) => (<><Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} /><span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-normal'}`}>{label}</span></>)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
