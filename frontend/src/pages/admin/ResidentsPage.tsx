import { useState } from 'react'
import { Search, Filter, UserPlus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TrustScore } from '@/components/ui/TrustScore'

const RESIDENTS = [
  { id: '1', name: 'Priya Menon',    apartment: 'A-101', email: 'priya@example.com', role: 'resident', trustScore: 91, status: 'Active',   joined: 'Jan 2024', dues: 0 },
  { id: '2', name: 'Rahul Kumar',    apartment: 'B-204', email: 'rahul@example.com', role: 'resident', trustScore: 78, status: 'Active',   joined: 'Mar 2024', dues: 0 },
  { id: '3', name: 'Anita Sharma',   apartment: 'A-302', email: 'anita@example.com', role: 'resident', trustScore: 85, status: 'Active',   joined: 'Jun 2023', dues: 2850 },
  { id: '4', name: 'Suresh Patel',   apartment: 'C-105', email: 'suresh@example.com',role: 'resident', trustScore: 62, status: 'Overdue',  joined: 'Aug 2023', dues: 5700 },
  { id: '5', name: 'Meena Rajan',    apartment: 'B-401', email: 'meena@example.com', role: 'resident', trustScore: 94, status: 'Active',   joined: 'Feb 2023', dues: 0 },
  { id: '6', name: 'Vikram Nair',    apartment: 'C-303', email: 'vikram@example.com',role: 'resident', trustScore: 71, status: 'Active',   joined: 'Oct 2024', dues: 0 },
  { id: '7', name: 'Sunita Rao',     apartment: 'A-202', email: 'sunita@example.com',role: 'resident', trustScore: 88, status: 'Active',   joined: 'Apr 2023', dues: 0 },
  { id: '8', name: 'Arun Thomas',    apartment: 'D-110', email: 'arun@example.com',  role: 'partner',  trustScore: 84, status: 'Active',   joined: 'Jul 2024', dues: 0 },
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
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Residents</h1>
          <p className="text-xs text-muted-foreground">{RESIDENTS.length} total members</p>
        </div>
        <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>Invite</Button>
      </div>

      <Input
        placeholder="Search by name, flat, or email..."
        leftIcon={<Search className="w-4 h-4" />}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
          >
            {f} {f !== 'All' ? `(${RESIDENTS.filter(r => f === 'Partner' ? r.role === 'partner' : r.status === f).length})` : `(${RESIDENTS.length})`}
          </button>
        ))}
      </div>

      {/* Residents List */}
      <div className="space-y-2">
        {filtered.map(resident => (
          <Card key={resident.id} padding="md" hoverable>
            <div className="flex items-center gap-3">
              <Avatar name={resident.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{resident.name}</p>
                  {resident.role === 'partner' && <Badge variant="purple">Partner</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{resident.apartment} · Joined {resident.joined}</p>
                <p className="text-xs text-muted-foreground">{resident.email}</p>
                {resident.dues > 0 && (
                  <p className="text-xs text-destructive font-medium mt-0.5">Dues pending: ₹{resident.dues.toLocaleString()}</p>
                )}
              </div>
              <div className="text-right shrink-0 space-y-1">
                <TrustScore score={resident.trustScore} size="sm" />
                <Badge variant={
                  resident.status === 'Active'  ? 'success' :
                  resident.status === 'Overdue' ? 'danger' : 'neutral'
                }>
                  {resident.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No residents match your search</p>
        </div>
      )}
    </div>
  )
}
