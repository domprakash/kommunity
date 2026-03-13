import { useState } from 'react'
import { Plus, Megaphone, Pin, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { timeAgo } from '@/utils/formatters'

type Category = 'General' | 'Urgent' | 'Finance' | 'Event' | 'Maintenance'

interface Notice {
  id: string; title: string; body: string; category: Category
  postedBy: string; postedAt: Date; isPinned: boolean; views: number
}

const INITIAL_NOTICES: Notice[] = [
  { id: '1', title: 'Water Supply Interruption', body: 'Block B water supply will be off on 15th March from 10 AM to 2 PM due to maintenance work.', category: 'Urgent', postedBy: 'RWA Admin', postedAt: new Date(Date.now() - 2 * 3600000), isPinned: true, views: 142 },
  { id: '2', title: 'Gate Closing Time Update', body: 'From April 1st, the main gate will close at 11 PM instead of midnight. Residents requiring late entry should contact security.', category: 'General', postedBy: 'RWA Admin', postedAt: new Date(Date.now() - 18 * 3600000), isPinned: false, views: 98 },
  { id: '3', title: 'Maintenance Dues Reminder', body: 'March maintenance dues are due by 10th March. Please clear dues to avoid late fees.', category: 'Finance', postedBy: 'Finance Team', postedAt: new Date(Date.now() - 3 * 86400000), isPinned: true, views: 201 },
  { id: '4', title: 'Holi Celebration on 14th March', body: 'Join us for the annual Holi celebration at the Garden Area on 14th March at 5 PM. Registration fee: ₹200/person.', category: 'Event', postedBy: 'Events Team', postedAt: new Date(Date.now() - 5 * 86400000), isPinned: false, views: 176 },
]

const CATEGORY_VARIANTS: Record<Category, 'danger' | 'warning' | 'success' | 'primary' | 'neutral'> = {
  Urgent: 'danger', Finance: 'warning', Event: 'success', Maintenance: 'primary', General: 'neutral',
}

const CATEGORIES: Category[] = ['General', 'Urgent', 'Finance', 'Event', 'Maintenance']

export function NoticesAdminPage() {
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES)
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<Category>('General')

  const togglePin = (id: string) =>
    setNotices(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n))

  const deleteNotice = (id: string) =>
    setNotices(prev => prev.filter(n => n.id !== id))

  const publish = () => {
    if (!title || !body) return
    setNotices(prev => [{
      id: Date.now().toString(), title, body, category,
      postedBy: 'RWA Admin', postedAt: new Date(), isPinned: false, views: 0,
    }, ...prev])
    setTitle(''); setBody(''); setCategory('General'); setModalOpen(false)
  }

  const sorted = [...notices].sort((a, b) => Number(b.isPinned) - Number(a.isPinned))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{notices.length} published · {notices.filter(n => n.isPinned).length} pinned</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>New Notice</Button>
      </div>

      <div className="space-y-3">
        {sorted.map(notice => (
          <Card key={notice.id} padding="md" className={notice.isPinned ? 'border-primary/30 bg-primary/5' : ''}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Megaphone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{notice.title}</h3>
                    {notice.isPinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                    <Badge variant={CATEGORY_VARIANTS[notice.category]}>{notice.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{notice.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notice.postedBy} · {timeAgo(notice.postedAt)} · {notice.views} views</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePin(notice.id)}
                  className={`p-2 rounded-lg transition-colors ${notice.isPinned ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}
                  title={notice.isPinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className="w-4 h-4" />
                </button>
                <button onClick={() => deleteNotice(notice.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Post New Notice">
        <div className="space-y-4">
          <Input label="Title" placeholder="Notice title..." value={title} onChange={e => setTitle(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${category === c ? 'bg-primary text-white border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Body</label>
            <textarea className="input w-full resize-none h-28" placeholder="Notice content..." value={body} onChange={e => setBody(e.target.value)} />
          </div>
          <Button className="w-full" onClick={publish} disabled={!title || !body}>Publish Notice</Button>
        </div>
      </Modal>
    </div>
  )
}
