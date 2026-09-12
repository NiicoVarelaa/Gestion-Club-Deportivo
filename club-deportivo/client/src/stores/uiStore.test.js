import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './uiStore.js'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: false })
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
})