import { useState } from 'react'
import { Plus, Trash2, BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'

interface PollOption { label: string; votes: number }
interface Poll {
  id: string; question: string; options: PollOption[]
  totalVotes: number; endsAt: string; status: 'active' | 'closed'
}

const INITIAL_POLLS: Poll[] = [
  { id: '1', question: 'Should we add a second swimming pool?', options: [{ label: 'Yes, strongly agree', votes: 42 }, { label: 'Yes, but smaller', votes: 28 }, { label: 'No, maintain existing', votes: 15 }], totalVotes: 85, endsAt: '18 Mar 2026', status: 'active' },
  { id: '2', question: 'Preferred timing for weekly maintenance?', options: [{ label: 'Weekday mornings', votes: 55 }, { label: 'Weekend mornings', votes: 30 }, { label: 'Weekday evenings', votes: 20 }], totalVotes: 105, endsAt: '20 Mar 2026', status: 'active' },
  { id: '3', question: 'Should we allow pet dogs in the garden area?', options: [{ label: 'Yes, with leash', votes: 68 }, { label: 'No', votes: 32 }], totalVotes: 100, endsAt: '10 Mar 2026', status: 'closed' },
]

export function PollsAdminPage() {
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS)
  const [modalOpen, setModalOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [endsAt, setEndsAt] = useState('')

  const closePolll = (id: string) =>
    setPolls(prev => prev.map(p => p.id === id ? { ...p, status: 'closed' } : p))

  const deletePoll = (id: string) =>
    setPolls(prev => prev.filter(p => p.id !== id))

  const publish = () => {
    if (!question || options.filter(Boolean).length < 2) return
    setPolls(prev => [{
      id: Date.now().toString(), question,
      options: options.filter(Boolean).map(label => ({ label, votes: 0 })),
      totalVotes: 0, endsAt, status: 'active',
    }, ...prev])
    setQuestion(''); setOptions(['', '']); setEndsAt(''); setModalOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Polls</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{polls.filter(p => p.status === 'active').length} active · {polls.filter(p => p.status === 'closed').length} closed</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>New Poll</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {polls.map(poll => (
          <Card key={poll.id} padding="md" className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 flex-1">
                <BarChart3 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <h3 className="text-sm font-semibold text-foreground">{poll.question}</h3>
              </div>
              <Badge variant={poll.status === 'active' ? 'success' : 'neutral'}>{poll.status}</Badge>
            </div>

            <div className="space-y-2">
              {poll.options.map((opt, i) => {
                const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">{opt.label}</span>
                      <span className="text-muted-foreground">{pct}% ({opt.votes})</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{poll.totalVotes} votes · Ends {poll.endsAt}</span>
              <div className="flex gap-2">
                {poll.status === 'active' && (
                  <Button size="sm" variant="ghost" onClick={() => closePolll(poll.id)}>Close Poll</Button>
                )}
                <button onClick={() => deletePoll(poll.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Poll">
        <div className="space-y-4">
          <Input label="Question" placeholder="What would you like to ask residents?" value={question} onChange={e => setQuestion(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Options</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <Input key={i} placeholder={`Option ${i + 1}`} value={opt} onChange={e => setOptions(prev => prev.map((o, j) => j === i ? e.target.value : o))} />
              ))}
            </div>
            {options.length < 5 && (
              <button onClick={() => setOptions(prev => [...prev, ''])} className="text-xs text-primary mt-2 hover:underline">+ Add option</button>
            )}
          </div>
          <Input label="End Date" type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} />
          <Button className="w-full" onClick={publish} disabled={!question || options.filter(Boolean).length < 2}>Publish Poll</Button>
        </div>
      </Modal>
    </div>
  )
}
