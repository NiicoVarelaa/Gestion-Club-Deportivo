import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TableSkeleton, CardSkeleton, StatsSkeleton } from '@/components/Skeleton'

describe('TableSkeleton', () => {
  it('renders rows x cols skeleton blocks', () => {
    const { container } = render(<TableSkeleton rows={3} cols={4} />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(12)
  })
})

describe('StatsSkeleton', () => {
  it('renders 4 stat cards with 3 skeleton blocks each', () => {
    const { container } = render(<StatsSkeleton />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(12)
  })
})

describe('CardSkeleton', () => {
  it('renders count cards with 4 skeleton blocks each', () => {
    const { container } = render(<CardSkeleton count={2} />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(8)
  })
})