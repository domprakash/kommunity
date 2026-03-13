import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, AlertTriangle, TrendingUp, IndianRupee } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatCurrency, timeAgo } from '@/utils/formatters'

const REVENUE_DATA = [
  { month: 'Sep', collected: 182000, pending: 28000 },
  { month: 'Oct', collected: 194000, pending: 21000 },
  { month: 'Nov', collected: 188000, pending: 32000 },
  { month: 'Dec', collected: 201000, pending: 19000 },
  { month: 'Jan', collected: 195000, pending: 25000 },
  { month: 'Feb', collected: 208000, pending: 17000 },
  { month: 'Mar', collected: 145000, pending: 55000 },
]

const ACTIVITY_DATA = [
  { day: 'Mon', complaints: 4, events: 2, bookings: 12 },
  { day: 'Tue', complaints: 6, events: 1, bookings: 8 },
  { day: 'Wed', complaints: 3, events: 3, bookings: 15 },
  { day: 'Thu', complaints: 7, events: 2, bookings: 11 },
  { day: 'Fri', complaints: 5, events: 4, bookings: 18 },
  { day: 'Sat', complaints: 2, events: 6, bookings: 22 },
  { day: 'Sun', complaints: 1, events: 5, bookings: 14 },
]

const COMPLAINT_STATUS = [
  { name: 'Open', value: 23, color: '#EF4444' },
  { name: 'In Progress', value: 15, color: '#F59E0B' },
  { name: 'Resolved', value: 62, color: '#10B981' },
]

const RECENT_ACTIVITY = [
  { id: '1', user: 'Priya Menon',  action: 'Submitted complaint about lift in Tower C', time: new Date(Date.now() - 1200000),  type: 'complaint' },
  { id: '2', user: 'Rahul Kumar',  action: 'Paid maintenance dues for March',           time: new Date(Date.now() - 3600000),  type: 'payment'   },
  { id: '3', user: 'Anita Sharma', action: 'Registered for Holi event',                 time: new Date(Date.now() - 7200000),  type: 'event'     },
  { id: '4', user: 'Suresh Patel', action: 'Booked parking slot B2-45',                 time: new Date(Date.now() - 10800000), type: 'booking'   },
  { id: '5', user: 'Meena Rajan',  action: 'Joined Photography Club',                   time: new Date(Date.now() - 14400000), type: 'community' },
  { id: '6', user: 'Vikram Nair',  action: 'Listed Sony headphones on marketplace',     time: new Date(Date.now() - 18000000), type: 'community' },
]

const STAT_CARDS = [
  { label: 'Total Residents', value: '248',              change: '+3 this month',      icon: Users,         color: 'bg-blue-50 text-blue-600',  border: 'border-blue-100'  },
  { label: 'Open Complaints', value: '23',               change: '5 urgent',           icon: AlertTriangle, color: 'bg-red-50 text-red-600',    border: 'border-red-100'   },
  { label: 'Collection Rate', value: '91%',              change: '+2% vs last month',  icon: TrendingUp,    color: 'bg-green-50 text-green-600', border: 'border-green-100' },
  { label: 'Dues Pending',    value: formatCurrency(55000), change: '18 flats overdue', icon: IndianRupee,  color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
]

export function AdminOverviewPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sunrise Apartments · March 2026</p>
        </div>
      </div>

      {/* Stat Cards — 4 columns */}
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, change, icon: Icon, color, border }) => (
          <Card key={label} padding="md" className={`border ${border}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{change}</p>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue chart — 2 cols wide */}
        <Card padding="md" className="col-span-2">
          <h2 className="text-sm font-semibold text-foreground mb-4">Maintenance Collection (7 months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="collected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area type="monotone" dataKey="collected" stroke="#2563EB" fill="url(#collected)" strokeWidth={2} name="Collected" />
              <Area type="monotone" dataKey="pending" stroke="#EF4444" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Complaint status pie */}
        <Card padding="md">
          <h2 className="text-sm font-semibold text-foreground mb-4">Complaint Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={COMPLAINT_STATUS} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {COMPLAINT_STATUS.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {COMPLAINT_STATUS.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Weekly activity — 2 cols */}
        <Card padding="md" className="col-span-2">
          <h2 className="text-sm font-semibold text-foreground mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ACTIVITY_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -10 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="complaints" fill="#EF4444" radius={[3,3,0,0]} name="Complaints" />
              <Bar dataKey="bookings"   fill="#2563EB" radius={[3,3,0,0]} name="Bookings" />
              <Bar dataKey="events"     fill="#10B981" radius={[3,3,0,0]} name="Events" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent activity feed */}
        <Card padding="md">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <Avatar name={item.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{item.user}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{item.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(item.time)}</p>
                </div>
                <Badge variant={
                  item.type === 'complaint' ? 'danger' :
                  item.type === 'payment'   ? 'success' :
                  item.type === 'event'     ? 'purple' : 'neutral'
                }>
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
