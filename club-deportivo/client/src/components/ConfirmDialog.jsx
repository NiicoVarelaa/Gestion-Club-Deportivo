import Modal from './Modal'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="mb-6 text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn btn-secondary">
          Cancelar
        </button>
        <button onClick={onConfirm} className="btn btn-danger">
          Confirmar
        </button>
      </div>
    </Modal>
  )
}
