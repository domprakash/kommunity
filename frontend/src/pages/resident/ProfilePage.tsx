import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, LogOut, Bell, Shield, HelpCircle,
  Star, Award, Wallet, Users, Settings, ChevronDown, ChevronUp
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/authService'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TrustScore } from '@/components/ui/TrustScore'
import { formatCurrency } from '@/utils/formatters'

const TRUST_BREAKDOWN = [
  { label: 'Payment History',    score: 95, weight: 30 },
  { label: 'Community Participation', score: 78, weight: 25 },
  { label: 'Incident Free Record',    score: 100, weight: 20 },
  { label: 'Service Ratings',         score: 88, weight: 15 },
  { label: 'Neighbour Reviews',       score: 72, weight: 10 },
]

const BADGES = [
  { icon: Star,   label: 'Early Adopter',  earned: true,  desc: 'Joined in first month' },
  { icon: Award,  label: 'Top Reviewer',   earned: true,  desc: '10+ verified reviews' },
  { icon: Users,  label: 'Community Hero', earned: true,  desc: 'Resolved 5 issues' },
  { icon: Shield, label: 'Trusted Payer',  earned: true,  desc: '12 months on time' },
  { icon: Star,   label: 'Event Organizer',earned: false, desc: 'Organize 3 events' },
  { icon: Award,  label: 'Ambassador',     earned: false, desc: 'Invite 10 neighbours' },
]

const MENU_ITEMS = [
  { icon: Bell,        label: 'Notifications',   desc: 'Manage alerts' },
  { icon: Shield,      label: 'Privacy & Safety', desc: 'Data & permissions' },
  { icon: HelpCircle,  label: 'Help & Support',   desc: 'FAQs, contact us' },
  { icon: Settings,    label: 'Account Settings', desc: 'Edit profile, password' },
]

export function ProfilePage() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [walletOpen, setWalletOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card padding="md">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar ?? undefined} name={user?.name ?? 'User'} size="xl" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground">{user?.name ?? 'Resident'}</h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.flatNumber ?? 'Tower A, 404'} · {user?.communityName ?? 'Sunrise Apartments'}</p>
              <div className="mt-2">
                <TrustScore score={user?.trustScore ?? 82} size="md" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* TrustScore Breakdown */}
      <Card padding="md">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Trust Score Breakdown
        </h3>
        <div className="space-y-3">
          {TRUST_BREAKDOWN.map(({ label, score, weight }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{label} <span className="text-foreground font-medium">({weight}%)</span></span>
                <span className={`font-semibold ${score >= 90 ? 'text-accent' : score >= 70 ? 'text-amber-500' : 'text-destructive'}`}>{score}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`h-full rounded-full ${score >= 90 ? 'bg-accent' : score >= 70 ? 'bg-amber-400' : 'bg-destructive'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Badges */}
      <Card padding="md">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" /> My Badges
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(({ icon: Icon, label, earned, desc }) => (
            <div key={label} className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center ${earned ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30 opacity-50'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${earned ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-semibold text-foreground leading-tight">{label}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Wallet */}
      <Card padding="md">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setWalletOpen(o => !o)}
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Community Wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-accent">{formatCurrency(3200)}</span>
            {walletOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {walletOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-3 space-y-2 text-xs">
                {[
                  { label: 'Maintenance Paid', amount: -2850, date: '1 Mar 2026' },
                  { label: 'Marketplace Sale', amount: +1200, date: '22 Feb 2026' },
                  { label: 'Carpool Saving',   amount: +350,  date: '18 Feb 2026' },
                  { label: 'Event Registration', amount: -200, date: '10 Feb 2026' },
                ].map((tx, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-t border-border">
                    <div>
                      <p className="font-medium text-foreground">{tx.label}</p>
                      <p className="text-muted-foreground">{tx.date}</p>
                    </div>
                    <span className={`font-semibold ${tx.amount > 0 ? 'text-accent' : 'text-foreground'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Menu Items */}
      <Card padding="none">
        {MENU_ITEMS.map(({ icon: Icon, label, desc }, i) => (
          <button key={label} className={`flex items-center gap-3 w-full px-4 py-3.5 hover:bg-muted transition-colors ${i < MENU_ITEMS.length - 1 ? 'border-b border-border' : ''}`}>
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </Card>

      {/* Role badge */}
      <div className="text-center">
        <Badge variant="neutral">Role: {user?.role ?? 'resident'}</Badge>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full justify-center py-3 text-destructive text-sm font-medium hover:bg-destructive/10 rounded-xl transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  )
}
