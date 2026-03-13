import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { useAuthStore } from '@/store/authStore'
import type { Announcement } from '@/types'

interface UseAnnouncementsOptions {
  limitCount?: number
}

export function useAnnouncements({ limitCount = 20 }: UseAnnouncementsOptions = {}) {
  const { user } = useAuthStore()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.communityId) return

    const q = query(
      collection(db, 'announcements'),
      where('communityId', '==', user.communityId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Announcement[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Announcement))
        setAnnouncements(items)
        setLoading(false)
      },
      (err) => {
        console.error('Announcements listener error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.communityId, limitCount])

  return { announcements, loading, error }
}
