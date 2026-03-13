import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { TrustScore } from '@/components/ui/TrustScore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import {
  Bell, Zap, Calendar, ShoppingBag, Wrench, Users,
  Car, FileText, TrendingUp, ArrowRight, AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils/formatters'

const QUICK_ACTIONS = [
  { icon: Bell,     label: 'Notices',    color: 'bg-blue-100 text-blue-600',   path: '/resident/community' },
  { icon: Calendar, label: 'Events',     color: 'bg-purple-100 text-purple-600', path: '/resident/community' },
  { icon: Wrench,   label: 'Services',   color: 'bg-orange-100 text-orange-600', path: '/resident/services' },
  { icon: Car,      label: 'Carpool',    color: 'bg-green-100 text-green-600',  path: '/resident/services' },
  { icon: ShoppingBag, label: 'Market', color: 'bg-pink-100 text-pink-600',   path: '/resident/marketplace' },
  { icon: FileText, label: 'Complaints', color: 'bg-red-100 text-red-600',     path: '/resident/community' },
  { icon: Users,    label: 'Neighbours', color: 'bg-teal-100 text-teal-600',   path: '/resident/community' },
  { icon: TrendingUp,label: 'My Stats',  color: 'bg-indigo-100 text-indigo-600', path: '/resident/profile' },
]

const UPCOMING_EVENTS = [
  { id: '1', title: 'Rooftop Yoga', time: 'Today, 7:00 AM', attendees: 12, category: 'Fitness' },
  { id: '2', title: 'Community Clean-up Drive', time: 'Sat, 9:00 AM', attendees: 28, category: 'Events' },
  { id: '3', title: 'Monthly RWA Meeting', time: 'Sun, 11:00 AM', attendees: 45, category: 'Admin' },
]

const CARPOOL_OFFERS = [
  { id: '1', driver: 'Priya M.', initials: 'PM', route: 'Whitefield → Koramangala', time: '8:30 AM', seats: 2 },
  { id: '2', driver: 'Rahul K.', initials: 'RK', route: 'HSR → MG Road', time: '9:00 AM', seats: 1 },
]

export function HomePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: 'Maintenance Due', value: formatCurrency(2850), icon: Zap, variant: 'warning' as const },
    { label: 'Active Issues', value: '2', icon: AlertTriangle, variant: 'danger' as const },
    { label: 'Community Points', value: '340', icon: TrendingUp, variant: 'success' as const },
    { label: 'Neighbours Online', value: '14', icon: Users, variant: 'primary' as const },
  ]

  return (
    <div className="p-4 space-y-5">
      {/* Greeting + TrustScore */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar ?? undefined} name={user?.name ?? 'User'} size="md" />
          <div>
            <p className="text-xs text-muted-foreground">{greeting}</p>
            <p className="font-semibold text-foreground">{user?.name?.split(' ')[0] ?? 'Resident'} 👋</p>
            <p className="text-xs text-muted-foreground">{user?.flatNumber ?? 'Tower A, 404'}</p>
          </div>
        </div>
        <TrustScore score={user?.trustScore ?? 82} size="md" />
      </motion.div>

      {/* Urgent Banner */}
      <Card padding="sm" className="bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Water maintenance — Block B</p>
            <p className="text-xs text-amber-600">Today 10 AM – 2 PM · Water supply interrupted</p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(({ icon: Icon, label, color, path }) => (
            <button key={label} onClick={() => navigate(path)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted transition-colors">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground leading-tight text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, variant }) => (
          <Card key={label} padding="sm" hoverable>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                variant === 'warning' ? 'bg-amber-100 text-amber-600' :
                variant === 'danger'  ? 'bg-red-100 text-red-600' :
                variant === 'success' ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Upcoming Events</h2>
          <button className="text-xs text-primary font-medium flex items-center gap-1">
            See all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {UPCOMING_EVENTS.map(event => (
            <Card key={event.id} padding="sm" hoverable>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="primary">{event.category}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{event.attendees} going</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Carpool Today */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Carpool Today</h2>
          <button className="text-xs text-primary font-medium flex items-center gap-1">
            Offer ride <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {CARPOOL_OFFERS.map(offer => (
            <Card key={offer.id} padding="sm" hoverable>
              <div className="flex items-center gap-3">
                <Avatar name={offer.driver} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{offer.driver}</p>
                  <p className="text-xs text-muted-foreground truncate">{offer.route}</p>
                  <p className="text-xs text-muted-foreground">{offer.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={offer.seats > 1 ? 'success' : 'warning'}>{offer.seats} seat{offer.seats !== 1 ? 's' : ''}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
