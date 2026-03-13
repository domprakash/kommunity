// ─────────────────────────────────────────────────────────────────────────────
// KOMMUNITY — Core TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'resident' | 'admin' | 'partner'

export interface User {
  id: string; name: string; email: string; avatar?: string
  role: UserRole; communityId: string; communityName: string
  flatNumber?: string; phone?: string; trustScore: number
  badges: Badge[]; interests: string[]
  createdAt: string; lastLogin: string; isVerified: boolean
}

export interface Badge { id: string; name: string; emoji: string; description: string; earnedAt?: string; earned: boolean }

export interface Community { id: string; name: string; location: string; address: string; totalResidents: number; adminId: string; logo?: string; createdAt: string }

export type AnnouncementCategory = 'General' | 'Urgent' | 'Finance' | 'Event' | 'Maintenance'
export interface Announcement { id: string; title: string; body: string; category: AnnouncementCategory; authorId: string; authorName: string; communityId: string; views: number; isPinned: boolean; createdAt: string; updatedAt: string }

export interface CommunityEvent { id: string; title: string; description: string; date: string; time: string; location: string; communityId: string; organizerId: string; attendees: string[]; maxAttendees?: number; price?: number; image?: string; status: 'upcoming'|'ongoing'|'past'|'cancelled'; createdAt: string }

export type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
export type ComplaintCategory = 'maintenance' | 'noise' | 'security' | 'cleanliness' | 'parking' | 'other'
export interface Complaint { id: string; title: string; description: string; category: ComplaintCategory; status: ComplaintStatus; submittedBy: string; submitterName: string; assignedTo?: string; assigneeName?: string; communityId: string; images?: string[]; comments: ComplaintComment[]; createdAt: string; updatedAt: string; resolvedAt?: string }
export interface ComplaintComment { id: string; authorId: string; authorName: string; text: string; createdAt: string }

export interface Poll { id: string; title: string; description?: string; communityId: string; createdBy: string; options: PollOption[]; totalVoters: number; deadline: string; status: 'active'|'closed'; createdAt: string }
export interface PollOption { id: string; label: string; votes: number; voterIds: string[] }

export type MarketplaceCategory = 'Furniture' | 'Electronics' | 'Kids' | 'Sports' | 'Books' | 'Other'
export interface MarketplaceListing { id: string; title: string; description: string; price: number; category: MarketplaceCategory; images: string[]; sellerId: string; sellerName: string; communityId: string; status: 'active'|'sold'|'reserved'; likes: string[]; condition: 'new'|'like-new'|'good'|'fair'; createdAt: string }

export interface ParkingSlot { id: string; slotNumber: string; ownerId: string; ownerName: string; vehicleType: 'car'|'bike'|'any'; isAvailable: boolean; pricePerDay: number; communityId: string }

export interface Club { id: string; name: string; description: string; tag: string; adminId: string; members: string[]; communityId: string; image?: string; createdAt: string }

export type ServiceCategory = 'Home Repairs' | 'Cleaning' | 'Tutoring' | 'Fitness' | 'Music' | 'Elder Care'
export interface ServiceProvider { id: string; name: string; category: ServiceCategory; avatar?: string; rating: number; reviewCount: number; trustScore: number; isVerified: boolean; isAvailable: boolean; hourlyRate: number; communityIds: string[]; bio: string; experience: string; skills: string[]; createdAt: string }

export interface Booking { id: string; providerId: string; providerName: string; customerId: string; customerName: string; serviceType: ServiceCategory; date: string; time: string; duration: number; status: 'pending'|'confirmed'|'in_progress'|'completed'|'cancelled'; amount: number; review?: Review; communityId: string; createdAt: string }
export interface Review { id: string; bookingId: string; reviewerId: string; reviewerName: string; rating: number; comment: string; createdAt: string }

export interface CarpoolOffer { id: string; driverId: string; driverName: string; driverAvatar?: string; driverRating: number; driverTrustScore: number; from: string; to: string; departureTime: string; availableSeats: number; pricePerSeat: number; vehicleType?: string; communityId: string; passengers: string[]; status: 'active'|'full'|'completed'|'cancelled'; createdAt: string }

export type NotificationType = 'announcement'|'complaint_update'|'poll'|'event'|'marketplace'|'carpool'|'booking'|'system'
export interface Notification { id: string; userId: string; type: NotificationType; title: string; body: string; isRead: boolean; link?: string; createdAt: string }

export interface MaintenancePayment { id: string; residentId: string; residentName: string; flatNumber: string; amount: number; period: string; status: 'pending'|'paid'|'overdue'; paidAt?: string; communityId: string }

export interface ApiResponse<T> { success: boolean; data: T; message?: string }
export interface PaginatedResponse<T> { success: boolean; data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } }
