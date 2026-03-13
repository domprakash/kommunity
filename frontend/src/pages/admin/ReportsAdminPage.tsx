import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Download, TrendingUp, Users, Star, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/formatters'

const MONTHLY_REVENUE = [
  { month: 'Oct', revenue: 194000 }, { month: 'Nov', revenue: 188000 },
  { month: 'Dec', revenue: 201000 }, { month: 'Jan', revenue: 195000 },
  { month: 'Feb', revenue: 208000 }, { month: 'Mar', revenue: 145000 },
]

const ENGAGEMENT = [
  { month: 'Oct', events: 8, complaints: 18, polls: 3 },
  { month: 'Nov', events: 6, complaints: 22, polls: 2 },
  { month: 'Dec', events: 12, complaints: 15, polls: 5 },
  { month: 'Jan', events: 9, complaints: 19, polls: 4 },
  { month: 'Feb', events: 11, complaints: 14, polls: 3 },
  { month: 'Mar', events: 5, complaints: 23, polls: 2 },
]

const TOP_RESIDENTS = [
  { name: 'Meena Rajan',  flat: 'B-401', trustScore: 94, events: 8, reviews: 12 },
  { name: 'Priya Menon',  flat: 'A-101', trustScore: 91, events: 6, reviews: 9 },
  { name: 'Sunita Rao',   flat: 'A-202', trustScore: 88, events: 5, reviews: 7 },
  { name: 'Rahul Kumar',  flat: 'B-204', trustScore: 78, events: 4, reviews: 5 },
  { name: 'Vikram Nair',  flat: 'C-303', trustScore: 71, events: 3, reviews: 4 },
]

const SUMMARY_STATS = [
  { label: 'Avg Trust Score',      value: '81.2',               sub: '+3.4 vs last quarter', icon: Star,          color: 'text-amber-600 bg-amber-50' },
  { label: 'Active Residents',     value: '231 / 248',          sub: '93% participation',    icon: Users,         color: 'text-blue-600 bg-blue-50'   },
  { label: 'Revenue YTD',          value: formatCurrency(1113000), sub: 'vs ₹11.4L target',  icon: TrendingUp,    color: 'text-green-600 bg-green-50' },
  { label: 'Avg Resolution Time',  value: '2.4 days',           sub: '-0.8 days vs last mo', icon: AlertTriangle, color: 'text-red-600 bg-red-50'     },
]

export function ReportsAdminPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Community performance overview</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {SUMMARY_STATS.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} padding="md">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card padding="md">
          <h2 className="text-sm font-semibold text-foreground mb-4">Monthly Revenue (6 months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#rev)" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="md">
          <h2 className="text-sm font-semibold text-foreground mb-4">Community Engagement (6 months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ENGAGEMENT} margin={{ top: 5, right: 10, bottom: 0, left: -10 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="events"     fill="#2563EB" radius={[3,3,0,0]} name="Events" />
              <Bar dataKey="complaints" fill="#EF4444" radius={[3,3,0,0]} name="Complaints" />
              <Bar dataKey="polls"      fill="#10B981" radius={[3,3,0,0]} name="Polls" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top residents table */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-foreground mb-4">Top Engaged Residents</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Resident</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Flat</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Trust Score</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Events Attended</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Reviews Given</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TOP_RESIDENTS.map((r, i) => (
              <tr key={r.name} className="hover:bg-slate-50 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <span className="text-sm font-medium text-foreground">{r.name}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-muted-foreground">{r.flat}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${r.trustScore}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{r.trustScore}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-foreground">{r.events}</td>
                <td className="py-3 text-sm text-foreground">{r.reviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
