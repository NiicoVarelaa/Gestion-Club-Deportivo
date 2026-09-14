import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmptyState from './EmptyState.jsx'

describe('EmptyState', () => {
  it('renders default title and description', () => {
    render(<EmptyState />)
    expect(screen.getByText('No hay datos')).toBeInTheDocument()
    expect(
      screen.getByText('No se encontraron resultados para mostrar.')
    ).toBeInTheDocument()
  })

  it('renders custom title and description', () => {
    render(<EmptyState title="Sin socios" description="No hay socios aún." />)
    expect(screen.getByText('Sin socios')).toBeInTheDocument()
    expect(screen.getByText('No hay socios aún.')).toBeInTheDocument()
  })

  it('renders action button and fires onClick', () => {
    const onClick = vi.fn()
    render(<EmptyState action={{ label: 'Crear socio', onClick }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Crear socio' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('renders action as a link when href is provided', () => {
    render(<EmptyState action={{ label: 'Ir a socios', href: '/socios' }} />)
    const link = screen.getByRole('link', { name: 'Ir a socios' })
    expect(link).toHaveAttribute('href', '/socios')
  })
})