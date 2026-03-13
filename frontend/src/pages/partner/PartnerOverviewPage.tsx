import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CheckCircle2, XCircle, Clock, Star, TrendingUp, IndianRupee, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { TrustScore } from '@/components/ui/TrustScore'
import { formatCurrency, timeAgo } from '@/utils/formatters'
import { useAuthStore } from '@/store/authStore'

const EARNINGS_DATA = [
  { week: 'W1', earnings: 8400 },
  { week: 'W2', earnings: 12200 },
  { week: 'W3', earnings: 9800 },
  { week: 'W4', earnings: 15600 },
  { week: 'W5', earnings: 11400 },
  { week: 'W6', earnings: 18200 },
]

interface Booking {
  id: string
  resident: string
  apartment: string
  service: string
  date: string
  time: string
  amount: number
  status: 'pending' | 'accepted' | 'declined'
  requestedAt: Date
}

const INITIAL_BOOKINGS: Booking[] = [
  { id: '1', resident: 'Priya Menon', apartment: 'A-101', service: 'Electrical Repair', date: '14 Mar 2026', time: '10:00 AM', amount: 700, status: 'pending', requestedAt: new Date(Date.now() - 1800000) },
  { id: '2', resident: 'Rahul Kumar', apartment: 'B-204', service: 'Fan Installation', date: '15 Mar 2026', time: '3:00 PM', amount: 350, status: 'pending', requestedAt: new Date(Date.now() - 4 * 3600000) },
  { id: '3', resident: 'Anita Sharma', apartment: 'A-302', service: 'Wiring Check', date: '12 Mar 2026', time: '11:00 AM', amount: 500, status: 'accepted', requestedAt: new Date(Date.now() - 86400000) },
  { id: '4', resident: 'Suresh Patel', apartment: 'C-105', service: 'Light Fitting', date: '10 Mar 2026', time: '2:00 PM', amount: 280, status: 'accepted', requestedAt: new Date(Date.now() - 3 * 86400000) },
  { id: '5', resident: 'Vikram Nair', apartment: 'C-303', service: 'Board Repair', date: '8 Mar 2026', time: '9:00 AM', amount: 450, status: 'declined', requestedAt: new Date(Date.now() - 5 * 86400000) },
]

const STAT_CARDS = [
  { label: 'This Month',    value: formatCurrency(75600), icon: IndianRupee, color: 'bg-green-100 text-green-600' },
  { label: 'Completed Jobs', value: '28',               icon: CheckCircle2, color: 'bg-blue-100 text-blue-600' },
  { label: 'Avg Rating',     value: '4.9 ★',            icon: Star,         color: 'bg-amber-100 text-amber-600' },
  { label: 'Pending',        value: '2',                 icon: Clock,        color: 'bg-orange-100 text-orange-600' },
]

export function PartnerOverviewPage() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')

  const updateBooking = (id: string, status: 'accepted' | 'declined') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const displayedBookings = activeTab === 'pending'
    ? bookings.filter(b => b.status === 'pending')
    : bookings

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Partner Dashboard</h1>
          <p className="text-xs text-muted-foreground">{user?.displayName ?? 'Service Partner'} · March 2026</p>
        </div>
        <TrustScore score={user?.trustScore ?? 88} size="lg" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} padding="md" hoverable>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-base font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Card>
        ))}
      </div>

      {/* Earnings Chart */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" /> Earnings (6 weeks)
        </h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={EARNINGS_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -10 }} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="earnings" fill="#10B981" radius={[4, 4, 0, 0]} name="Earnings" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Bookings</h2>
          <div className="flex gap-2">
            {(['pending', 'all'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeTab === t ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}`}
              >
                {t === 'pending' ? `Pending (${bookings.filter(b => b.status === 'pending').length})` : 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {displayedBookings.length === 0 && (
            <Card padding="md">
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No pending bookings</p>
              </div>
            </Card>
          )}

          {displayedBookings.map(booking => (
            <Card key={booking.id} padding="md">
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={booking.resident} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{booking.resident}</p>
                    <Badge variant="neutral">{booking.apartment}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{booking.service}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.date} · {booking.time}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-accent">{formatCurrency(booking.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">{timeAgo(booking.requestedAt)}</p>
                </div>
              </div>

              {booking.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90 text-white" leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={() => updateBooking(booking.id, 'accepted')}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive hover:bg-destructive/10" leftIcon={<XCircle className="w-4 h-4" />} onClick={() => updateBooking(booking.id, 'declined')}>
                    Decline
                  </Button>
                </div>
              ) : (
                <Badge variant={booking.status === 'accepted' ? 'success' : 'danger'} className="w-full justify-center py-1.5">
                  {booking.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
