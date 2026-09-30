import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '@/components/Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="Título">contenido</Modal>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders title and children when open', () => {
    render(<Modal isOpen onClose={vi.fn()} title="Título">contenido</Modal>)
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('closes when clicking the overlay', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Título">contenido</Modal>
    )
    fireEvent.click(container.querySelector('[class*="bg-black"]'))
    expect(onClose).toHaveBeenCalled()
  })

  it('closes when clicking the X button', () => {
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} title="Título">contenido</Modal>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalled()
  })
})