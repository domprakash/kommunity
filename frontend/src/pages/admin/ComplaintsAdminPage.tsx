import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Clock, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { timeAgo } from '@/utils/formatters'

type Status = 'Open' | 'In Progress' | 'Resolved'

interface Complaint {
  id: string
  title: string
  description: string
  category: string
  status: Status
  submittedBy: string
  apartment: string
  submittedAt: Date
  upvotes: number
  adminNote: string
}

const INITIAL_COMPLAINTS: Complaint[] = [
  { id: '1', title: 'Lift not working in Tower C', description: 'The lift in Tower C has been non-functional since 2 days. Multiple residents including elderly and those with kids are severely impacted.', category: 'Infrastructure', status: 'In Progress', submittedBy: 'Priya Menon', apartment: 'A-101', submittedAt: new Date(Date.now() - 4 * 3600000), upvotes: 23, adminNote: 'Engineer scheduled for 14th March' },
  { id: '2', title: 'Stray dogs near entrance', description: 'Multiple stray dogs near the main entrance are causing concern, especially for children during school hours.', category: 'Security', status: 'Open', submittedBy: 'Rahul Kumar', apartment: 'B-204', submittedAt: new Date(Date.now() - 86400000), upvotes: 11, adminNote: '' },
  { id: '3', title: 'Garbage not collected — Block A', description: 'Garbage bins near Block A were not collected for 2 days. Foul smell is spreading to nearby flats.', category: 'Sanitation', status: 'Resolved', submittedBy: 'Anita Sharma', apartment: 'A-302', submittedAt: new Date(Date.now() - 2 * 86400000), upvotes: 7, adminNote: 'Resolved — contractor notified and rescheduled' },
  { id: '4', title: 'Broken streetlight near parking', description: 'The streetlight near the visitor parking area is non-functional for the past week, creating safety concerns at night.', category: 'Safety', status: 'Open', submittedBy: 'Suresh Patel', apartment: 'C-105', submittedAt: new Date(Date.now() - 3 * 86400000), upvotes: 18, adminNote: '' },
  { id: '5', title: 'Water leakage in B-Block stairwell', description: 'Persistent water seepage on the stairwell walls of B-Block between floors 2 and 3. Wall paint is peeling.', category: 'Infrastructure', status: 'In Progress', submittedBy: 'Meena Rajan', apartment: 'B-401', submittedAt: new Date(Date.now() - 5 * 86400000), upvotes: 15, adminNote: 'Waterproofing work scheduled for next week' },
]

const STATUS_OPTIONS: Status[] = ['Open', 'In Progress', 'Resolved']
const FILTERS = ['All', 'Open', 'In Progress', 'Resolved']

function statusIcon(status: Status) {
  if (status === 'Resolved')    return <CheckCircle2 className="w-4 h-4 text-accent" />
  if (status === 'In Progress') return <Clock className="w-4 h-4 text-amber-500" />
  return <AlertTriangle className="w-4 h-4 text-destructive" />
}

function statusVariant(status: Status): 'success' | 'warning' | 'danger' {
  if (status === 'Resolved')    return 'success'
  if (status === 'In Progress') return 'warning'
  return 'danger'
}

export function ComplaintsAdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS)
  const [filter, setFilter] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const filtered = complaints.filter(c => filter === 'All' || c.status === filter)

  const updateStatus = (id: string, status: Status) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const saveNote = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, adminNote: notes[id] ?? c.adminNote } : c))
    setExpandedId(null)
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Complaints</h1>
        <p className="text-xs text-muted-foreground">{complaints.filter(c => c.status !== 'Resolved').length} unresolved issues</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Complaint Cards */}
      <div className="space-y-3">
        {filtered.map(complaint => {
          const isExpanded = expandedId === complaint.id
          return (
            <Card key={complaint.id} padding="md">
              {/* Header */}
              <button
                className="w-full text-left"
                onClick={() => setExpandedId(isExpanded ? null : complaint.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {statusIcon(complaint.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground leading-tight">{complaint.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{complaint.apartment} · {complaint.submittedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={statusVariant(complaint.status)}>{complaint.status}</Badge>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <Badge variant="neutral">{complaint.category}</Badge>
                  <span>{complaint.upvotes} upvotes</span>
                  <span>{timeAgo(complaint.submittedAt)}</span>
                </div>
              </button>

              {/* Expanded Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-border space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">{complaint.description}</p>

                      {/* Status Update */}
                      <div>
                        <p className="text-xs font-medium text-foreground mb-2">Update Status</p>
                        <div className="flex gap-2 flex-wrap">
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(complaint.id, s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                complaint.status === s
                                  ? s === 'Resolved' ? 'bg-accent text-white border-accent'
                                  : s === 'In Progress' ? 'bg-amber-500 text-white border-amber-500'
                                  : 'bg-destructive text-white border-destructive'
                                  : 'bg-card text-muted-foreground border-border hover:border-primary'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Admin Note */}
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> Admin Note
                        </p>
                        <textarea
                          className="input w-full resize-none h-16 text-xs"
                          placeholder="Add a note visible to the resident..."
                          defaultValue={complaint.adminNote}
                          onChange={e => setNotes(n => ({ ...n, [complaint.id]: e.target.value }))}
                        />
                        {complaint.adminNote && !notes[complaint.id] && (
                          <p className="text-xs text-muted-foreground mt-1">Current: {complaint.adminNote}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => saveNote(complaint.id)}>Save Update</Button>
                        <Button size="sm" variant="ghost" onClick={() => setExpandedId(null)}>Cancel</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
