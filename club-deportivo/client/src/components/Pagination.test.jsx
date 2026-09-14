import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination.jsx'

describe('Pagination', () => {
  it('renders nothing when there is a single page', () => {
    const { container } = render(
      <Pagination page={1} pages={1} total={3} onPageChange={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the total results text', () => {
    render(<Pagination page={1} pages={5} total={50} onPageChange={vi.fn()} />)
    expect(screen.getByText('50 resultados')).toBeInTheDocument()
  })

  it('renders the page number buttons', () => {
    render(<Pagination page={1} pages={5} total={50} onPageChange={vi.fn()} />)
    for (const n of [1, 2, 3, 4, 5]) {
      expect(screen.getByRole('button', { name: String(n) })).toBeInTheDocument()
    }
  })

  it('disables previous on the first page', () => {
    render(<Pagination page={1} pages={5} total={50} onPageChange={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
  })

  it('calls onPageChange with the next page', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={2} pages={5} total={50} onPageChange={onPageChange} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})