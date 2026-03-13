import { useState } from 'react'
import { Search, Trash2, Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency, timeAgo } from '@/utils/formatters'

type ListingStatus = 'active' | 'sold' | 'flagged'

interface Listing {
  id: string; title: string; price: number; category: string
  seller: string; flat: string; status: ListingStatus
  postedAt: Date; image: string; condition: string
}

const LISTINGS: Listing[] = [
  { id: '1', title: 'Sony WH-1000XM5 Headphones', price: 12000, category: 'Electronics', seller: 'Rahul Kumar',  flat: 'B-204', status: 'active',  postedAt: new Date(Date.now() - 3 * 3600000),   image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80', condition: 'Like New' },
  { id: '2', title: 'Wooden Study Table',          price: 3500,  category: 'Furniture',   seller: 'Meena Rajan', flat: 'B-401', status: 'active',  postedAt: new Date(Date.now() - 86400000),      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=80', condition: 'Good' },
  { id: '3', title: 'Yoga Mat (Manduka)',           price: 800,   category: 'Sports',      seller: 'Priya Menon', flat: 'A-101', status: 'sold',    postedAt: new Date(Date.now() - 2 * 86400000),  image: 'https://images.unsplash.com/photo-1601925228737-ce7b6e2e7875?w=80&q=80', condition: 'Good' },
  { id: '4', title: 'Baby Walker — Graco',          price: 1200,  category: 'Kids',        seller: 'Anita Sharma',flat: 'A-302', status: 'flagged', postedAt: new Date(Date.now() - 3 * 86400000),  image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=80&q=80', condition: 'Fair' },
  { id: '5', title: 'Road Bicycle (Trek)',          price: 22000, category: 'Sports',      seller: 'Vikram Nair', flat: 'C-303', status: 'active',  postedAt: new Date(Date.now() - 4 * 86400000),  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80', condition: 'Like New' },
]

const FILTERS = ['all', 'active', 'sold', 'flagged'] as const

export function MarketplaceAdminPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all')
  const [listings, setListings] = useState<Listing[]>(LISTINGS)

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.seller.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (filter === 'all' || l.status === filter)
  })

  const remove = (id: string) => setListings(prev => prev.filter(l => l.id !== id))
  const approve = (id: string) => setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'active' } : l))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{listings.filter(l => l.status === 'active').length} active · {listings.filter(l => l.status === 'flagged').length} flagged</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-80">
          <Input placeholder="Search listings..." leftIcon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}>
              {f} <span className="ml-1 text-xs opacity-70">{f === 'all' ? listings.length : listings.filter(l => l.status === f).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Listing</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Category</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Seller</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Price</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Posted</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(l => (
              <tr key={l.id} className={`hover:bg-slate-50 transition-colors ${l.status === 'flagged' ? 'bg-red-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={l.image} alt={l.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.condition}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4"><Badge variant="neutral">{l.category}</Badge></td>
                <td className="px-4 py-4">
                  <p className="text-sm text-foreground">{l.seller}</p>
                  <p className="text-xs text-muted-foreground">{l.flat}</p>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-foreground">{formatCurrency(l.price)}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{timeAgo(l.postedAt)}</td>
                <td className="px-4 py-4">
                  <Badge variant={l.status === 'active' ? 'success' : l.status === 'flagged' ? 'danger' : 'neutral'}>{l.status}</Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    {l.status === 'flagged' && (
                      <Button size="sm" variant="ghost" onClick={() => approve(l.id)}>Approve</Button>
                    )}
                    <button onClick={() => remove(l.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground">No listings found</p>
          </div>
        )}
      </div>
    </div>
  )
}
