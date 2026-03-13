import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { observeAuthState, getUserProfile } from '@/services/authService'
import { ResidentLayout } from '@/components/layout/ResidentLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PartnerLayout } from '@/components/layout/PartnerLayout'
import { Skeleton } from '@/components/ui/Skeleton'

// Lazy-loaded pages
const LoginPage        = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const OnboardingPage   = lazy(() => import('@/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })))

const HomePage         = lazy(() => import('@/pages/resident/HomePage').then(m => ({ default: m.HomePage })))
const CommunityPage    = lazy(() => import('@/pages/resident/CommunityPage').then(m => ({ default: m.CommunityPage })))
const MarketplacePage  = lazy(() => import('@/pages/resident/MarketplacePage').then(m => ({ default: m.MarketplacePage })))
const ServicesPage     = lazy(() => import('@/pages/resident/ServicesPage').then(m => ({ default: m.ServicesPage })))
const ProfilePage      = lazy(() => import('@/pages/resident/ProfilePage').then(m => ({ default: m.ProfilePage })))

const AdminOverviewPage  = lazy(() => import('@/pages/admin/AdminOverviewPage').then(m => ({ default: m.AdminOverviewPage })))
const ResidentsPage      = lazy(() => import('@/pages/admin/ResidentsPage').then(m => ({ default: m.ResidentsPage })))
const ComplaintsAdminPage= lazy(() => import('@/pages/admin/ComplaintsAdminPage').then(m => ({ default: m.ComplaintsAdminPage })))

const PartnerOverviewPage= lazy(() => import('@/pages/partner/PartnerOverviewPage').then(m => ({ default: m.PartnerOverviewPage })))

// Page loader fallback
function PageLoader() {
  return (
    <div className="p-4 space-y-3">
      <div className="skeleton h-32 rounded-2xl" />
      <div className="skeleton h-20 rounded-2xl" />
      <div className="skeleton h-20 rounded-2xl" />
    </div>
  )
}

// Route guard by role
function PrivateRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) {
    // Redirect to their correct portal
    const dest = user?.role === 'admin' ? '/admin' : user?.role === 'partner' ? '/partner' : '/resident'
    return <Navigate to={dest} replace />
  }

  return <>{children}</>
}

export default function App() {
  const { setUser, clearAuth, isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = observeAuthState(async (authUser) => {
      if (authUser) {
        const profile = await getUserProfile(authUser.uid)
        if (profile) setUser(profile)
        else clearAuth()
      } else {
        clearAuth()
      }
    })
    return () => unsubscribe()
  }, [setUser, clearAuth])

  // Determine default redirect after login
  function getDefaultRoute() {
    if (!isAuthenticated) return '/login'
    if (user?.role === 'admin') return '/admin'
    if (user?.role === 'partner') return '/partner'
    return '/resident'
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Resident */}
        <Route path="/resident" element={<PrivateRoute role="resident"><ResidentLayout /></PrivateRoute>}>
          <Route index element={<HomePage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="complaints" element={<ComplaintsAdminPage />} />
        </Route>

        {/* Partner */}
        <Route path="/partner" element={<PrivateRoute role="partner"><PartnerLayout /></PrivateRoute>}>
          <Route index element={<PartnerOverviewPage />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Suspense>
  )
}
