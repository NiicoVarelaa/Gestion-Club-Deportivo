import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/stores/uiStore'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: false, sidebarCollapsed: false })
  })

  it('starts with the sidebar closed', () => {
    expect(useUIStore.getState().sidebarOpen).toBe(false)
  })

  it('toggleSidebar toggles the sidebar state', () => {
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(true)

    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(false)
  })

  it('closeSidebar closes the sidebar', () => {
    useUIStore.setState({ sidebarOpen: true })

    useUIStore.getState().closeSidebar()

    expect(useUIStore.getState().sidebarOpen).toBe(false)
  })

  it('starts with the sidebar expanded', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
  })

  it('toggleCollapsed toggles the collapsed state', () => {
    useUIStore.getState().toggleCollapsed()
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)

    useUIStore.getState().toggleCollapsed()
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
  })
})