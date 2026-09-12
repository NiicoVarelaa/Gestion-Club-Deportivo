vi.mock('../src/utils/supabase.js', () => ({
  getSupabase: vi.fn(),
}))

vi.mock('../src/utils/logger.js', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))