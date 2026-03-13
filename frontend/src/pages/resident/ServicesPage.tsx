import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Phone, Car, Plus, Zap, Droplets, Bug, Paintbrush, Dumbbell, Baby } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { TrustScore } from '@/components/ui/TrustScore'
import { formatCurrency } from '@/utils/formatters'

const CATEGORIES = [
  { id: 'electrician', label: 'Electrician', icon: Zap,         color: 'bg-yellow-100 text-yellow-600' },
  { id: 'plumber',     label: 'Plumber',     icon: Droplets,    color: 'bg-blue-100 text-blue-600' },
  { id: 'pest',        label: 'Pest Control',icon: Bug,         color: 'bg-green-100 text-green-600' },
  { id: 'painter',     label: 'Painter',     icon: Paintbrush,  color: 'bg-purple-100 text-purple-600' },
  { id: 'fitness',     label: 'Fitness',     icon: Dumbbell,    color: 'bg-red-100 text-red-600' },
  { id: 'childcare',   label: 'Childcare',   icon: Baby,        color: 'bg-pink-100 text-pink-600' },
]

const PROVIDERS: Record<string, Array<{id:string; name:string; rating:number; reviews:number; rate:string; trustScore:number; badge:string; available:boolean}>> = {
  electrician: [
    { id: 'e1', name: 'Suresh Kumar', rating: 4.9, reviews: 142, rate: '₹350/hr', trustScore: 91, badge: 'Top Rated', available: true },
    { id: 'e2', name: 'Ravi Electricals', rating: 4.7, reviews: 88, rate: '₹300/hr', trustScore: 84, badge: 'Verified', available: true },
    { id: 'e3', name: 'PowerFix Services', rating: 4.5, reviews: 63, rate: '₹280/hr', trustScore: 76, badge: 'Verified', available: false },
  ],
  plumber: [
    { id: 'p1', name: 'Ajay Plumbing', rating: 4.8, reviews: 97, rate: '₹400/visit', trustScore: 88, badge: 'Top Rated', available: true },
    { id: 'p2', name: 'FlowFix Pro', rating: 4.6, reviews: 54, rate: '₹350/visit', trustScore: 79, badge: 'Verified', available: true },
  ],
  pest: [
    { id: 'pc1', name: 'GreenShield Pest', rating: 4.9, reviews: 112, rate: '₹1200/flat', trustScore: 93, badge: 'Top Rated', available: true },
  ],
  painter: [
    { id: 'pt1', name: 'ColorCraft Painters', rating: 4.7, reviews: 76, rate: '₹18/sq.ft', trustScore: 85, badge: 'Verified', available: true },
  ],
  fitness: [
    { id: 'f1', name: 'Coach Vikram', rating: 4.9, reviews: 201, rate: '₹500/session', trustScore: 94, badge: 'Elite', available: true },
  ],
  childcare: [
    { id: 'c1', name: 'Anita Daycare', rating: 4.8, reviews: 58, rate: '₹8000/month', trustScore: 90, badge: 'Top Rated', available: true },
  ],
}

const CARPOOL_OFFERS = [
  { id: '1', driver: 'Priya M.', initials: 'PM', route: 'Whitefield → Koramangala', time: '8:30 AM', seats: 2, days: 'Mon–Fri' },
  { id: '2', driver: 'Rahul K.', initials: 'RK', route: 'HSR Layout → MG Road', time: '9:00 AM', seats: 1, days: 'Mon, Wed, Fri' },
  { id: '3', driver: 'Sunita R.', initials: 'SR', route: 'Sarjapur → Bellandur', time: '8:00 AM', seats: 3, days: 'Mon–Fri' },
]

export function ServicesPage() {
  const [view, setView] = useState<'home' | 'providers' | 'detail'>('home')
  const [serviceTab, setServiceTab] = useState<'services' | 'carpool'>('services')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<typeof PROVIDERS['electrician'][0] | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [offerRideOpen, setOfferRideOpen] = useState(false)

  const selectCategory = (id: string) => {
    setSelectedCategory(id)
    setView('providers')
  }

  const selectProvider = (p: typeof PROVIDERS['electrician'][0]) => {
    setSelectedProvider(p)
    setView('detail')
  }

  return (
    <div className="flex flex-col">
      {/* Sub-tabs */}
      {view === 'home' && (
        <div className="flex border-b border-border bg-card sticky top-0 z-10">
          {(['services', 'carpool'] as const).map(t => (
            <button key={t} onClick={() => setServiceTab(t)}
              className={`flex-1 py-3 text-xs font-medium capitalize transition-colors border-b-2 ${serviceTab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            >{t === 'services' ? 'Home Services' : 'Carpool'}</button>
          ))}
        </div>
      )}

      {/* Provider list header */}
      {(view === 'providers' || view === 'detail') && (
        <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <button onClick={() => setView(view === 'detail' ? 'providers' : 'home')} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-foreground capitalize">
            {view === 'detail' ? selectedProvider?.name : CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </h2>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={`${view}-${serviceTab}`} initial={{ opacity: 0, x: view === 'home' ? 0 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="px-4 py-4 space-y-3">

          {/* HOME — Services Grid */}
          {view === 'home' && serviceTab === 'services' && (
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(({ id, label, icon: Icon, color }) => (
                <button key={id} onClick={() => selectCategory(id)} className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border hover:border-primary transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* HOME — Carpool */}
          {view === 'home' && serviceTab === 'carpool' && (
            <>
              <Button className="w-full" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setOfferRideOpen(true)}>Offer a Ride</Button>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">Available rides</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              {CARPOOL_OFFERS.map(offer => (
                <Card key={offer.id} padding="md" hoverable>
                  <div className="flex items-center gap-3">
                    <Avatar name={offer.driver} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{offer.driver}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Car className="w-3 h-3" /> {offer.route}
                      </div>
                      <p className="text-xs text-muted-foreground">{offer.time} · {offer.days}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant={offer.seats > 1 ? 'success' : 'warning'}>{offer.seats} seat{offer.seats !== 1 ? 's' : ''}</Badge>
                      <Button size="sm" className="mt-1 block">Request</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}

          {/* PROVIDERS LIST */}
          {view === 'providers' && selectedCategory && PROVIDERS[selectedCategory]?.map(provider => (
            <Card key={provider.id} padding="md" hoverable onClick={() => selectProvider(provider)}>
              <div className="flex items-center gap-3">
                <Avatar name={provider.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{provider.name}</p>
                    <Badge variant={provider.badge === 'Elite' ? 'purple' : provider.badge === 'Top Rated' ? 'success' : 'primary'}>{provider.badge}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {provider.rating} <span className="text-muted-foreground">({provider.reviews})</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{provider.rate}</p>
                </div>
                <div className="text-right shrink-0">
                  <TrustScore score={provider.trustScore} size="sm" />
                  <Badge variant={provider.available ? 'success' : 'neutral'} className="mt-1">{provider.available ? 'Available' : 'Busy'}</Badge>
                </div>
              </div>
            </Card>
          ))}

          {/* PROVIDER DETAIL */}
          {view === 'detail' && selectedProvider && (
            <div className="space-y-4">
              <Card padding="md">
                <div className="flex items-center gap-4">
                  <Avatar name={selectedProvider.name} size="xl" />
                  <div>
                    <h2 className="text-base font-bold text-foreground">{selectedProvider.name}</h2>
                    <div className="flex items-center gap-1 text-xs text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(selectedProvider.rating) ? 'fill-current' : 'text-muted-foreground'}`} />
                      ))}
                      <span className="text-muted-foreground ml-1">{selectedProvider.reviews} reviews</span>
                    </div>
                    <TrustScore score={selectedProvider.trustScore} size="md" />
                  </div>
                </div>
              </Card>
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-3">Service Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span className="font-medium">{selectedProvider.rate}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={selectedProvider.available ? 'success' : 'neutral'}>{selectedProvider.available ? 'Available' : 'Busy'}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Badge</span><Badge variant="primary">{selectedProvider.badge}</Badge></div>
                </div>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" leftIcon={<Phone className="w-4 h-4" />}>Call</Button>
                <Button className="flex-1" onClick={() => setBookingOpen(true)}>Book Now</Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Booking Modal */}
      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} title="Book Service">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Book <strong>{selectedProvider?.name}</strong> for your home service.</p>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Date & Time</label>
            <input type="datetime-local" className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
            <textarea className="input w-full h-20 resize-none" placeholder="Any specific instructions..." />
          </div>
          <Button className="w-full" onClick={() => setBookingOpen(false)}>Confirm Booking</Button>
        </div>
      </Modal>

      {/* Offer Ride Modal */}
      <Modal isOpen={offerRideOpen} onClose={() => setOfferRideOpen(false)} title="Offer a Ride">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Route</label>
            <input className="input w-full" placeholder="From → To" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Time</label>
              <input type="time" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Seats</label>
              <select className="input w-full">
                {[1,2,3,4].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <Button className="w-full" onClick={() => setOfferRideOpen(false)}>Post Ride</Button>
        </div>
      </Modal>
    </div>
  )
}
