import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { timeAgo } from '@/utils/formatters'

type Status = 'Open' | 'In Progress' | 'Resolved'

interface Complaint {
  id: string; title: string; description: string; category: string
  status: Status; submittedBy: string; apartment: string
  submittedAt: Date; upvotes: number; adminNote: string
}

const INITIAL_COMPLAINTS: Complaint[] = [
  { id: '1', title: 'Lift not working in Tower C',        description: 'The lift in Tower C has been non-functional since 2 days. Multiple residents including elderly and those with kids are severely impacted.', category: 'Infrastructure', status: 'In Progress', submittedBy: 'Priya Menon',  apartment: 'A-101', submittedAt: new Date(Date.now() - 4 * 3600000),   upvotes: 23, adminNote: 'Engineer scheduled for 14th March' },
  { id: '2', title: 'Stray dogs near entrance',           description: 'Multiple stray dogs near the main entrance are causing concern, especially for children during school hours.',                                category: 'Security',       status: 'Open',        submittedBy: 'Rahul Kumar',  apartment: 'B-204', submittedAt: new Date(Date.now() - 86400000),      upvotes: 11, adminNote: '' },
  { id: '3', title: 'Garbage not collected — Block A',    description: 'Garbage bins near Block A were not collected for 2 days. Foul smell is spreading to nearby flats.',                                          category: 'Sanitation',     status: 'Resolved',    submittedBy: 'Anita Sharma', apartment: 'A-302', submittedAt: new Date(Date.now() - 2 * 86400000),  upvotes: 7,  adminNote: 'Resolved — contractor notified and rescheduled' },
  { id: '4', title: 'Broken streetlight near parking',    description: 'The streetlight near the visitor parking area is non-functional for the past week, creating safety concerns at night.',                        category: 'Safety',         status: 'Open',        submittedBy: 'Suresh Patel', apartment: 'C-105', submittedAt: new Date(Date.now() - 3 * 86400000),  upvotes: 18, adminNote: '' },
  { id: '5', title: 'Water leakage in B-Block stairwell', description: 'Persistent water seepage on the stairwell walls of B-Block between floors 2 and 3. Wall paint is peeling.',                                  category: 'Infrastructure', status: 'In Progress', submittedBy: 'Meena Rajan',  apartment: 'B-401', submittedAt: new Date(Date.now() - 5 * 86400000),  upvotes: 15, adminNote: 'Waterproofing work scheduled for next week' },
]

const STATUS_OPTIONS: Status[] = ['Open', 'In Progress', 'Resolved']
const FILTERS = ['All', 'Open', 'In Progress', 'Resolved']

function StatusIcon({ status }: { status: Status }) {
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
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const filtered = complaints.filter(c => filter === 'All' || c.status === filter)
  const selected = complaints.find(c => c.id === selectedId) ?? null

  const updateStatus = (id: string, status: Status) =>
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))

  const saveNote = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, adminNote: notes[id] ?? c.adminNote } : c))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{complaints.filter(c => c.status !== 'Resolved').length} unresolved issues</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
          >
            {f} <span className="ml-1 text-xs opacity-70">
              {f === 'All' ? complaints.length : complaints.filter(c => c.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-5 gap-4 items-start">
        {/* List */}
        <div className="col-span-2 space-y-2">
          {filtered.map(complaint => (
            <button
              key={complaint.id}
              onClick={() => setSelectedId(complaint.id)}
              className={`w-full text-left rounded-2xl border p-4 transition-all ${selectedId === complaint.id ? 'border-primary bg-primary/5' : 'bg-card border-border hover:border-primary/40'}`}
            >
              <div className="flex items-start gap-3">
                <StatusIcon status={complaint.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight truncate">{complaint.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{complaint.apartment} · {complaint.submittedBy}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={statusVariant(complaint.status)}>{complaint.status}</Badge>
                    <Badge variant="neutral">{complaint.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{complaint.upvotes} upvotes</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="col-span-3">
          {selected ? (
            <Card padding="md" className="space-y-5">
              {/* Title row */}
              <div className="flex items-start gap-3">
                <StatusIcon status={selected.status} />
                <div className="flex-1">
                  <h2 className="text-base font-bold text-foreground">{selected.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(selected.submittedAt)} · {selected.upvotes} upvotes</p>
                </div>
                <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
              </div>

              {/* Submitter */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <Avatar name={selected.submittedBy} size="sm" />
                <div>
                  <p className="text-sm font-medium text-foreground">{selected.submittedBy}</p>
                  <p className="text-xs text-muted-foreground">Flat {selected.apartment} · <Badge variant="neutral">{selected.category}</Badge></p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
              </div>

              {/* Status Update */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selected.status === s
                          ? s === 'Resolved'    ? 'bg-accent text-white border-accent'
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
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Admin Note
                </p>
                {selected.adminNote && !notes[selected.id] && (
                  <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 mb-2">{selected.adminNote}</p>
                )}
                <textarea
                  className="input w-full resize-none h-20 text-sm"
                  placeholder="Add a note visible to the resident..."
                  defaultValue={selected.adminNote}
                  key={selected.id}
                  onChange={e => setNotes(n => ({ ...n, [selected.id]: e.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => saveNote(selected.id)}>Save Update</Button>
                <Button variant="ghost" onClick={() => setSelectedId(null)}>Close</Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-2xl border border-dashed border-border text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Select a complaint to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
