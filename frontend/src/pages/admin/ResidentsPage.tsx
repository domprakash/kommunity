import { useState } from 'react'
import { Search, UserPlus, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TrustScore } from '@/components/ui/TrustScore'

const RESIDENTS = [
  { id: '1', name: 'Priya Menon',    apartment: 'A-101', email: 'priya@example.com',  role: 'resident', trustScore: 91, status: 'Active',  joined: 'Jan 2024', dues: 0    },
  { id: '2', name: 'Rahul Kumar',    apartment: 'B-204', email: 'rahul@example.com',  role: 'resident', trustScore: 78, status: 'Active',  joined: 'Mar 2024', dues: 0    },
  { id: '3', name: 'Anita Sharma',   apartment: 'A-302', email: 'anita@example.com',  role: 'resident', trustScore: 85, status: 'Active',  joined: 'Jun 2023', dues: 2850 },
  { id: '4', name: 'Suresh Patel',   apartment: 'C-105', email: 'suresh@example.com', role: 'resident', trustScore: 62, status: 'Overdue', joined: 'Aug 2023', dues: 5700 },
  { id: '5', name: 'Meena Rajan',    apartment: 'B-401', email: 'meena@example.com',  role: 'resident', trustScore: 94, status: 'Active',  joined: 'Feb 2023', dues: 0    },
  { id: '6', name: 'Vikram Nair',    apartment: 'C-303', email: 'vikram@example.com', role: 'resident', trustScore: 71, status: 'Active',  joined: 'Oct 2024', dues: 0    },
  { id: '7', name: 'Sunita Rao',     apartment: 'A-202', email: 'sunita@example.com', role: 'resident', trustScore: 88, status: 'Active',  joined: 'Apr 2023', dues: 0    },
  { id: '8', name: 'Arun Thomas',    apartment: 'D-110', email: 'arun@example.com',   role: 'partner',  trustScore: 84, status: 'Active',  joined: 'Jul 2024', dues: 0    },
]

const FILTERS = ['All', 'Active', 'Overdue', 'Partner']

export function ResidentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = RESIDENTS.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.apartment.toLowerCase().includes(search.toLowerCase()) ||
                        r.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ||
      (filter === 'Partner' && r.role === 'partner') ||
      (filter !== 'Partner' && r.status === filter)
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Residents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{RESIDENTS.length} total members</p>
        </div>
        <Button leftIcon={<UserPlus className="w-4 h-4" />}>Invite Resident</Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="w-80">
          <Input
            placeholder="Search by name, flat, or email..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
            >
              {f} <span className="ml-1 text-xs opacity-70">
                {f === 'All' ? RESIDENTS.length :
                 f === 'Partner' ? RESIDENTS.filter(r => r.role === 'partner').length :
                 RESIDENTS.filter(r => r.status === f).length}
              </span>
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
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Joined</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Trust</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Dues</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(resident => (
              <tr key={resident.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={resident.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{resident.name}</p>
                      {resident.role === 'partner' && <Badge variant="purple">Partner</Badge>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-foreground font-medium">{resident.apartment}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{resident.email}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{resident.joined}</td>
                <td className="px-4 py-4"><TrustScore score={resident.trustScore} size="sm" /></td>
                <td className="px-4 py-4">
                  {resident.dues > 0
                    ? <span className="text-sm font-semibold text-destructive">₹{resident.dues.toLocaleString()}</span>
                    : <span className="text-sm text-accent font-medium">Paid</span>
                  }
                </td>
                <td className="px-4 py-4">
                  <Badge variant={resident.status === 'Active' ? 'success' : 'danger'}>{resident.status}</Badge>
                </td>
                <td className="px-4 py-4">
                  <Button size="sm" variant="ghost">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No residents match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
