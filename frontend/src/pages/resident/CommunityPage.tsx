import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Vote, AlertTriangle, Plus, ChevronRight, ThumbsUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { timeAgo } from '@/utils/formatters'

const TABS = [
  { id: 'notices',    label: 'Notices',    icon: Bell },
  { id: 'polls',      label: 'Polls',      icon: Vote },
  { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
]

const NOTICES = [
  { id: '1', title: 'Water Supply Interruption', body: 'Block B water supply will be off on 15th March from 10 AM to 2 PM due to maintenance work.', category: 'Urgent', postedBy: 'RWA Admin', postedAt: new Date(Date.now() - 2 * 3600000), likes: 0 },
  { id: '2', title: 'Gate Closing Time Update', body: 'From April 1st, the main gate will close at 11 PM instead of midnight. Residents requiring late entry should contact security.', category: 'General', postedBy: 'RWA Admin', postedAt: new Date(Date.now() - 18 * 3600000), likes: 14 },
  { id: '3', title: 'Parking Allocation Reminder', body: 'Kindly ensure vehicles are parked in designated spots only. Vehicles in fire lanes will be towed.', category: 'Reminder', postedBy: 'Security', postedAt: new Date(Date.now() - 3 * 86400000), likes: 8 },
]

const POLLS = [
  {
    id: '1',
    question: 'Should we add a second swimming pool?',
    options: [
      { label: 'Yes, strongly agree', votes: 42 },
      { label: 'Yes, but a smaller one', votes: 28 },
      { label: 'No, maintain existing pool', votes: 15 },
    ],
    totalVotes: 85,
    endsAt: '18 Mar 2026',
    userVoted: null as number | null,
  },
  {
    id: '2',
    question: 'Preferred timing for weekly maintenance?',
    options: [
      { label: 'Weekday mornings', votes: 55 },
      { label: 'Weekend mornings', votes: 30 },
      { label: 'Weekday evenings', votes: 20 },
    ],
    totalVotes: 105,
    endsAt: '20 Mar 2026',
    userVoted: 0 as number | null,
  },
]

const COMPLAINTS = [
  { id: '1', title: 'Lift not working in Tower C', status: 'In Progress', category: 'Infrastructure', postedAt: new Date(Date.now() - 4 * 3600000), upvotes: 23, description: 'The lift in Tower C has been non-functional since yesterday evening.' },
  { id: '2', title: 'Stray dogs near entrance', status: 'Open', category: 'Security', postedAt: new Date(Date.now() - 86400000), upvotes: 11, description: 'Multiple stray dogs near the main entrance are causing concern, especially for kids.' },
  { id: '3', title: 'Garbage not collected — Block A', status: 'Resolved', category: 'Sanitation', postedAt: new Date(Date.now() - 2 * 86400000), upvotes: 7, description: 'Garbage bins near Block A were not collected for 2 days.' },
]

const CATEGORIES: Record<string, string[]> = {
  notices: ['All', 'Urgent', 'General', 'Reminder', 'Event'],
  polls: ['All', 'Active', 'Closed'],
  complaints: ['All', 'Open', 'In Progress', 'Resolved'],
}

function statusBadge(status: string) {
  if (status === 'Resolved')    return <Badge variant="success">{status}</Badge>
  if (status === 'In Progress') return <Badge variant="warning">{status}</Badge>
  return <Badge variant="danger">{status}</Badge>
}

export function CommunityPage() {
  const [tab, setTab] = useState('notices')
  const [category, setCategory] = useState('All')
  const [polls, setPolls] = useState(POLLS)
  const [newComplaintOpen, setNewComplaintOpen] = useState(false)
  const [complaintTitle, setComplaintTitle] = useState('')
  const [complaintDesc, setComplaintDesc] = useState('')

  const vote = (pollId: string, optionIdx: number) => {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId || p.userVoted !== null) return p
      const newOptions = p.options.map((o, i) => i === optionIdx ? { ...o, votes: o.votes + 1 } : o)
      return { ...p, options: newOptions, totalVotes: p.totalVotes + 1, userVoted: optionIdx }
    }))
  }

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border bg-card sticky top-0 z-10">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setCategory('All') }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors border-b-2 ${tab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {CATEGORIES[tab].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pb-4 space-y-3">

          {/* NOTICES */}
          {tab === 'notices' && NOTICES
            .filter(n => category === 'All' || n.category === category)
            .map(notice => (
              <Card key={notice.id} padding="md" hoverable>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground flex-1">{notice.title}</h3>
                  <Badge variant={notice.category === 'Urgent' ? 'danger' : notice.category === 'Reminder' ? 'warning' : 'neutral'}>
                    {notice.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{notice.body}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{notice.postedBy} · {timeAgo(notice.postedAt)}</span>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" /> {notice.likes}
                  </button>
                </div>
              </Card>
            ))
          }

          {/* POLLS */}
          {tab === 'polls' && polls.map(poll => (
            <Card key={poll.id} padding="md">
              <h3 className="text-sm font-semibold text-foreground mb-4">{poll.question}</h3>
              <div className="space-y-2 mb-3">
                {poll.options.map((opt, idx) => {
                  const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0
                  const voted = poll.userVoted === idx
                  return (
                    <button key={idx} onClick={() => vote(poll.id, idx)} className="w-full text-left" disabled={poll.userVoted !== null}>
                      <div className={`relative rounded-xl overflow-hidden border transition-colors ${voted ? 'border-primary' : 'border-border'}`}>
                        <div className="absolute inset-0 bg-primary/10 transition-all" style={{ width: poll.userVoted !== null ? `${pct}%` : '0%' }} />
                        <div className="relative flex items-center justify-between px-3 py-2.5">
                          <span className={`text-xs font-medium ${voted ? 'text-primary' : 'text-foreground'}`}>{opt.label}</span>
                          {poll.userVoted !== null && <span className="text-xs text-muted-foreground">{pct}%</span>}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{poll.totalVotes} votes</span>
                <span>Ends {poll.endsAt}</span>
              </div>
            </Card>
          ))}

          {/* COMPLAINTS */}
          {tab === 'complaints' && (
            <>
              <Button className="w-full" variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setNewComplaintOpen(true)}>
                Report an Issue
              </Button>
              {COMPLAINTS.filter(c => category === 'All' || c.status === category).map(c => (
                <Card key={c.id} padding="md" hoverable>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground flex-1">{c.title}</h3>
                    {statusBadge(c.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{c.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Badge variant="neutral">{c.category}</Badge></span>
                    <div className="flex items-center gap-3">
                      <span>{timeAgo(c.postedAt)}</span>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" /> {c.upvotes} upvotes
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* New Complaint Modal */}
      <Modal isOpen={newComplaintOpen} onClose={() => setNewComplaintOpen(false)} title="Report an Issue">
        <div className="space-y-4">
          <Input label="Issue Title" placeholder="Brief summary" value={complaintTitle} onChange={e => setComplaintTitle(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              className="input w-full resize-none h-24"
              placeholder="Describe the issue in detail..."
              value={complaintDesc}
              onChange={e => setComplaintDesc(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={() => setNewComplaintOpen(false)} disabled={!complaintTitle}>
            Submit Issue
          </Button>
        </div>
      </Modal>
    </div>
  )
}
