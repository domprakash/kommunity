import { useState } from 'react'
import { Search, Download, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/utils/formatters'

type PaymentStatus = 'paid' | 'pending' | 'overdue'

interface Payment {
  id: string; residentName: string; flatNumber: string
  amount: number; period: string; status: PaymentStatus; paidAt?: string
}

const PAYMENTS: Payment[] = [
  { id: '1',  residentName: 'Priya Menon',    flatNumber: 'A-101', amount: 2850, period: 'Mar 2026', status: 'paid',    paidAt: '2 Mar 2026' },
  { id: '2',  residentName: 'Rahul Kumar',    flatNumber: 'B-204', amount: 2850, period: 'Mar 2026', status: 'paid',    paidAt: '4 Mar 2026' },
  { id: '3',  residentName: 'Anita Sharma',   flatNumber: 'A-302', amount: 2850, period: 'Mar 2026', status: 'pending'  },
  { id: '4',  residentName: 'Suresh Patel',   flatNumber: 'C-105', amount: 2850, period: 'Mar 2026', status: 'overdue'  },
  { id: '5',  residentName: 'Meena Rajan',    flatNumber: 'B-401', amount: 2850, period: 'Mar 2026', status: 'paid',    paidAt: '1 Mar 2026' },
  { id: '6',  residentName: 'Vikram Nair',    flatNumber: 'C-303', amount: 2850, period: 'Mar 2026', status: 'paid',    paidAt: '5 Mar 2026' },
  { id: '7',  residentName: 'Sunita Rao',     flatNumber: 'A-202', amount: 2850, period: 'Mar 2026', status: 'pending'  },
  { id: '8',  residentName: 'Arun Thomas',    flatNumber: 'D-110', amount: 2850, period: 'Mar 2026', status: 'overdue'  },
  { id: '9',  residentName: 'Kavya Reddy',    flatNumber: 'B-105', amount: 2850, period: 'Mar 2026', status: 'paid',    paidAt: '3 Mar 2026' },
  { id: '10', residentName: 'Rohit Gupta',    flatNumber: 'A-403', amount: 2850, period: 'Mar 2026', status: 'pending'  },
]

const FILTERS: Array<'all' | PaymentStatus> = ['all', 'paid', 'pending', 'overdue']

const statusIcon = (s: PaymentStatus) => {
  if (s === 'paid')    return <CheckCircle2 className="w-4 h-4 text-accent" />
  if (s === 'pending') return <Clock className="w-4 h-4 text-amber-500" />
  return <AlertTriangle className="w-4 h-4 text-destructive" />
}

export function FinanceAdminPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all')

  const filtered = PAYMENTS.filter(p => {
    const matchSearch = p.residentName.toLowerCase().includes(search.toLowerCase()) || p.flatNumber.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const totalCollected = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending   = PAYMENTS.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0)
  const collectionRate = Math.round((PAYMENTS.filter(p => p.status === 'paid').length / PAYMENTS.length) * 100)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">March 2026 maintenance dues</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: formatCurrency(totalCollected), sub: `${PAYMENTS.filter(p => p.status === 'paid').length} flats`, color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Pending',         value: formatCurrency(PAYMENTS.filter(p => p.status === 'pending').reduce((s,p)=>s+p.amount,0)), sub: `${PAYMENTS.filter(p=>p.status==='pending').length} flats`, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Overdue',         value: formatCurrency(PAYMENTS.filter(p => p.status === 'overdue').reduce((s,p)=>s+p.amount,0)),  sub: `${PAYMENTS.filter(p=>p.status==='overdue').length} flats`,  color: 'bg-red-50 text-red-700 border-red-100' },
          { label: 'Collection Rate', value: `${collectionRate}%`, sub: 'of total expected',   color: 'bg-blue-50 text-blue-700 border-blue-100' },
        ].map(({ label, value, sub, color }) => (
          <Card key={label} padding="md" className={`border ${color.split(' ')[2]}`}>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="w-72">
          <Input placeholder="Search by name or flat..." leftIcon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}>
              {f} <span className="ml-1 text-xs opacity-70">{f === 'all' ? PAYMENTS.length : PAYMENTS.filter(p => p.status === f).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Resident</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Flat</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Period</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Paid On</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{p.residentName}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{p.flatNumber}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{p.period}</td>
                <td className="px-4 py-4 text-sm font-semibold text-foreground">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{p.paidAt ?? '—'}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    {statusIcon(p.status)}
                    <Badge variant={p.status === 'paid' ? 'success' : p.status === 'overdue' ? 'danger' : 'warning'}>
                      {p.status}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {p.status !== 'paid' && <Button size="sm" variant="ghost">Send Reminder</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
