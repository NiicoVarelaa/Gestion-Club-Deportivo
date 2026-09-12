import { describe, it, expect, vi } from 'vitest'
import { asyncHandler } from './asyncHandler.js'

describe('asyncHandler', () => {
  it('resolves the wrapped function normally', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const handler = asyncHandler(fn)
    const req = {}
    const res = {}
    const next = vi.fn()

    await handler(req, res, next)

    expect(fn).toHaveBeenCalledWith(req, res, next)
    expect(next).not.toHaveBeenCalled()
  })

  it('forwards thrown errors to next', async () => {
    const error = new Error('boom')
    const fn = vi.fn().mockRejectedValue(error)
    const handler = asyncHandler(fn)
    const next = vi.fn()

    await handler({}, {}, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})