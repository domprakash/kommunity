import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Heart, ShoppingBag, Calendar, Car, Users, Plus, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatCurrency, timeAgo } from '@/utils/formatters'

const TABS = [
  { id: 'buy-sell', label: 'Buy & Sell', icon: ShoppingBag },
  { id: 'events',   label: 'Events',     icon: Calendar },
  { id: 'parking',  label: 'Parking',    icon: Car },
  { id: 'clubs',    label: 'Clubs',      icon: Users },
]

const LISTINGS = [
  { id: '1', title: 'Sony WH-1000XM5 Headphones', price: 12000, condition: 'Like New', seller: 'Rahul K.', postedAt: new Date(Date.now() - 3 * 3600000), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', liked: false },
  { id: '2', title: 'Wooden Study Table', price: 3500, condition: 'Good', seller: 'Meena S.', postedAt: new Date(Date.now() - 86400000), image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', liked: true },
  { id: '3', title: 'Yoga Mat (Manduka)', price: 800, condition: 'Good', seller: 'Priya A.', postedAt: new Date(Date.now() - 2 * 86400000), image: 'https://images.unsplash.com/photo-1601925228737-ce7b6e2e7875?w=400&q=80', liked: false },
  { id: '4', title: 'Baby Walker — Graco', price: 1200, condition: 'Fair', seller: 'Anand M.', postedAt: new Date(Date.now() - 3 * 86400000), image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80', liked: false },
]

const EVENTS = [
  { id: '1', title: 'Holi Celebration 2026', date: '14 Mar', time: '5:00 PM', location: 'Garden Area', price: 200, registered: 82, capacity: 120 },
  { id: '2', title: 'Kids Talent Show', date: '22 Mar', time: '4:00 PM', location: 'Clubhouse Hall', price: 0, registered: 34, capacity: 60 },
  { id: '3', title: 'Fitness Workshop', date: '29 Mar', time: '8:00 AM', location: 'Rooftop', price: 150, registered: 18, capacity: 25 },
]

const PARKING_SLOTS = [
  { id: '1', slot: 'B2-45', type: '4-Wheeler', available: 'Mon–Fri · 9AM–6PM', price: 50, owner: 'Flat 802' },
  { id: '2', slot: 'A1-12', type: '2-Wheeler', available: 'Weekends only', price: 20, owner: 'Flat 304' },
  { id: '3', slot: 'C3-08', type: '4-Wheeler', available: 'All day', price: 80, owner: 'Flat 1101' },
]

const CLUBS = [
  { id: '1', name: 'Book Lovers Circle', members: 28, meeting: 'Every Sunday 10AM', tag: 'Reading', joined: true },
  { id: '2', name: 'Fitness Freaks', members: 54, meeting: 'Mon / Wed / Fri 6AM', tag: 'Fitness', joined: false },
  { id: '3', name: 'Photography Club', members: 15, meeting: 'Monthly meetups', tag: 'Hobby', joined: false },
  { id: '4', name: 'Pet Parents', members: 22, meeting: 'Saturday morning walks', tag: 'Pets', joined: true },
]

export function MarketplacePage() {
  const [tab, setTab] = useState('buy-sell')
  const [search, setSearch] = useState('')
  const [listings, setListings] = useState(LISTINGS)
  const [clubs, setClubs] = useState(CLUBS)

  const toggleLike = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, liked: !l.liked } : l))
  }

  const toggleClub = (id: string) => {
    setClubs(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c))
  }

  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.seller.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border bg-card sticky top-0 z-10 overflow-x-auto scrollbar-hide">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 shrink-0 ${tab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Search (buy-sell only) */}
      {tab === 'buy-sell' && (
        <div className="px-4 pt-3 pb-1">
          <Input placeholder="Search listings..." leftIcon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-3 space-y-3">

        {/* BUY & SELL */}
        {tab === 'buy-sell' && (
          <>
            <Button variant="outline" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>List Something</Button>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(listing => (
                <Card key={listing.id} padding="none" hoverable className="overflow-hidden">
                  <div className="relative">
                    <img src={listing.image} alt={listing.title} className="w-full h-32 object-cover" />
                    <button
                      onClick={() => toggleLike(listing.id)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center transition-colors ${listing.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart className="w-4 h-4" fill={listing.liked ? 'currentColor' : 'none'} />
                    </button>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="neutral">{listing.condition}</Badge>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-foreground leading-tight mb-1 line-clamp-2">{listing.title}</p>
                    <p className="text-sm font-bold text-primary">{formatCurrency(listing.price)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{listing.seller} · {timeAgo(listing.postedAt)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* EVENTS */}
        {tab === 'events' && (
          <>
            {EVENTS.map(evt => (
              <Card key={evt.id} padding="md" hoverable>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-medium text-primary leading-none">{evt.date.split(' ')[1]}</span>
                    <span className="text-base font-bold text-primary leading-tight">{evt.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{evt.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" /> {evt.time}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {evt.location}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-accent">{evt.price === 0 ? 'Free' : formatCurrency(evt.price)}</p>
                    <p className="text-[10px] text-muted-foreground">{evt.registered}/{evt.capacity}</p>
                    <Button size="sm" className="mt-1">Register</Button>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {/* PARKING */}
        {tab === 'parking' && (
          <>
            <Button variant="outline" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>Share My Parking</Button>
            {PARKING_SLOTS.map(slot => (
              <Card key={slot.id} padding="md" hoverable>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Slot {slot.slot}</p>
                      <p className="text-xs text-muted-foreground">{slot.type} · {slot.owner}</p>
                      <p className="text-xs text-muted-foreground">{slot.available}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-primary">{formatCurrency(slot.price)}<span className="text-[10px] font-normal text-muted-foreground">/day</span></p>
                    <Button size="sm" className="mt-1">Book</Button>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {/* CLUBS */}
        {tab === 'clubs' && (
          <>
            {clubs.map(club => (
              <Card key={club.id} padding="md" hoverable>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground">{club.name}</h3>
                      <Badge variant="purple">{club.tag}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{club.members} members · {club.meeting}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={club.joined ? 'secondary' : 'primary'}
                    onClick={() => toggleClub(club.id)}
                  >
                    {club.joined ? 'Leave' : 'Join'}
                  </Button>
                </div>
              </Card>
            ))}
          </>
        )}
      </motion.div>
    </div>
  )
}
