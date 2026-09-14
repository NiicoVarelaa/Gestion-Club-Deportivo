import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from './DataTable.jsx'

describe('DataTable', () => {
  it('shows a table skeleton while loading', () => {
    const { container } = render(
      <DataTable loading skeleton={{ rows: 2, cols: 3 }} isEmpty={false} />
    )
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6)
  })

  it('shows the empty state when isEmpty', () => {
    render(<DataTable loading={false} isEmpty />)
    expect(screen.getByText('No hay datos')).toBeInTheDocument()
  })

  it('renders children when there is data', () => {
    render(
      <DataTable loading={false} isEmpty={false}>
        <p>fila</p>
      </DataTable>
    )
    expect(screen.getByText('fila')).toBeInTheDocument()
  })

  it('renders pagination and triggers onPageChange', () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        loading={false}
        isEmpty={false}
        pagination={{ page: 2, pages: 5, total: 50 }}
        onPageChange={onPageChange}
      >
        <p>fila</p>
      </DataTable>
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})