import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Users, AlertTriangle, TrendingUp, IndianRupee, CheckCircle2, Clock } from 'lucide-react'
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
  { id: '1', user: 'Priya Menon', action: 'Submitted complaint about lift in Tower C', time: new Date(Date.now() - 1200000), type: 'complaint' },
  { id: '2', user: 'Rahul Kumar', action: 'Paid maintenance dues for March', time: new Date(Date.now() - 3600000), type: 'payment' },
  { id: '3', user: 'Anita Sharma', action: 'Registered for Holi event', time: new Date(Date.now() - 7200000), type: 'event' },
  { id: '4', user: 'Suresh Patel', action: 'Booked parking slot B2-45', time: new Date(Date.now() - 10800000), type: 'booking' },
  { id: '5', user: 'Meena Rajan', action: 'Joined Photography Club', time: new Date(Date.now() - 14400000), type: 'community' },
]

const STAT_CARDS = [
  { label: 'Total Residents', value: '248', change: '+3 this month', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { label: 'Open Complaints', value: '23', change: '5 urgent', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  { label: 'Collection Rate', value: '91%', change: '+2% vs last month', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  { label: 'Dues Pending', value: formatCurrency(55000), change: '18 flats', icon: IndianRupee, color: 'bg-amber-100 text-amber-600' },
]

export function AdminOverviewPage() {
  return (
    <div className="p-4 space-y-5">
      <div>
        <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Sunrise Apartments · March 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {STAT_CARDS.map(({ label, value, change, icon: Icon, color }) => (
          <Card key={label} padding="md" hoverable>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs font-medium text-foreground">{label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{change}</p>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-foreground mb-3">Maintenance Collection (7 months)</h2>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="collected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Area type="monotone" dataKey="collected" stroke="#2563EB" fill="url(#collected)" strokeWidth={2} name="Collected" />
            <Area type="monotone" dataKey="pending" stroke="#EF4444" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="Pending" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Activity + Pie Row */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="sm">
          <h3 className="text-xs font-semibold text-foreground mb-2">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={ACTIVITY_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={6}>
              <XAxis dataKey="day" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip />
              <Bar dataKey="complaints" fill="#EF4444" radius={[2,2,0,0]} />
              <Bar dataKey="bookings" fill="#2563EB" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card padding="sm">
          <h3 className="text-xs font-semibold text-foreground mb-2">Complaint Status</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={COMPLAINT_STATUS} cx="50%" cy="50%" outerRadius={45} dataKey="value">
                {COMPLAINT_STATUS.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-1 mt-1">
            {COMPLAINT_STATUS.map(s => (
              <div key={s.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[9px] text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map(item => (
            <div key={item.id} className="flex items-start gap-3">
              <Avatar name={item.user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{item.user}</p>
                <p className="text-xs text-muted-foreground leading-tight">{item.action}</p>
                <p className="text-[10px] text-muted-foreground">{timeAgo(item.time)}</p>
              </div>
              <Badge variant={
                item.type === 'complaint' ? 'danger' :
                item.type === 'payment'   ? 'success' :
                item.type === 'event'     ? 'purple' :
                'neutral'
              }>
                {item.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
