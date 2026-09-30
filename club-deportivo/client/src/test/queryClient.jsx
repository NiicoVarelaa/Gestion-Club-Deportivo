import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // gcTime is kept so cache entries survive an unmount, which is what makes
      // the remount tests meaningful. Each test gets its own client, so nothing
      // leaks between them.
      queries: { retry: false, gcTime: Infinity, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function renderQueryHook(callback, options = {}) {
  const { client = createTestQueryClient(), ...rest } = options
  const wrapper = ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )

  return { ...renderHook(callback, { wrapper, ...rest }), client }
}

export function listResponse(data, total = data.length) {
  return {
    data: { data, pagination: { page: 1, limit: 10, total, pages: 1 } },
  }
}