import { create } from 'zustand'
import { readStored, writeStored } from '@/lib/storage'

function readCollapsed() {
  return readStored('sidebarCollapsed', { fallback: 'false' }) === 'true'
}

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: readCollapsed(),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleCollapsed: () =>
    set((state) => {
      const sidebarCollapsed = !state.sidebarCollapsed
      writeStored('sidebarCollapsed', String(sidebarCollapsed))
      return { sidebarCollapsed }
    }),
}))
