import { create } from 'zustand'

type ModalType = 'complaint' | 'listing' | 'event' | 'poll' | 'carpool' | null

interface UIState {
  activeModal: ModalType; openModal: (m: ModalType) => void; closeModal: () => void
  isSidebarOpen: boolean; toggleSidebar: () => void; closeSidebar: () => void
  isPageLoading: boolean; setPageLoading: (v: boolean) => void
  deviceMode: 'mobile'|'auto'; toggleDeviceMode: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  activeModal: null,
  openModal:   (modal) => set({ activeModal: modal }),
  closeModal:  ()      => set({ activeModal: null }),
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar:  () => set({ isSidebarOpen: false }),
  isPageLoading:  false,
  setPageLoading: (v) => set({ isPageLoading: v }),
  deviceMode:    'auto',
  toggleDeviceMode: () => set((s) => ({ deviceMode: s.deviceMode === 'auto' ? 'mobile' : 'auto' })),
}))
