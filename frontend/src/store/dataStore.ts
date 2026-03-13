import { create } from 'zustand'
import type { Announcement, CommunityEvent, Complaint, Poll, MarketplaceListing, ServiceProvider, CarpoolOffer, Notification } from '@/types'

interface DataState {
  announcements: Announcement[]; events: CommunityEvent[]; complaints: Complaint[]
  polls: Poll[]; listings: MarketplaceListing[]; serviceProviders: ServiceProvider[]
  carpoolOffers: CarpoolOffer[]; notifications: Notification[]; unreadCount: number
  loading: Record<string, boolean>
  setAnnouncements:    (d: Announcement[])     => void
  setEvents:           (d: CommunityEvent[])   => void
  setComplaints:       (d: Complaint[])        => void
  setPolls:            (d: Poll[])             => void
  setListings:         (d: MarketplaceListing[]) => void
  setServiceProviders: (d: ServiceProvider[])  => void
  setCarpoolOffers:    (d: CarpoolOffer[])     => void
  setNotifications:    (d: Notification[])     => void
  markNotificationRead:(id: string)            => void
  setLoading:          (key: string, v: boolean) => void
}

export const useDataStore = create<DataState>()((set) => ({
  announcements: [], events: [], complaints: [], polls: [],
  listings: [], serviceProviders: [], carpoolOffers: [],
  notifications: [], unreadCount: 0, loading: {},
  setAnnouncements:    (d) => set({ announcements: d }),
  setEvents:           (d) => set({ events: d }),
  setComplaints:       (d) => set({ complaints: d }),
  setPolls:            (d) => set({ polls: d }),
  setListings:         (d) => set({ listings: d }),
  setServiceProviders: (d) => set({ serviceProviders: d }),
  setCarpoolOffers:    (d) => set({ carpoolOffers: d }),
  setNotifications:    (d) => set({ notifications: d, unreadCount: d.filter((n) => !n.isRead).length }),
  markNotificationRead:(id) => set((s) => {
    const notifications = s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
    return { notifications, unreadCount: notifications.filter((n) => !n.isRead).length }
  }),
  setLoading: (key, v) => set((s) => ({ loading: { ...s.loading, [key]: v } })),
}))
