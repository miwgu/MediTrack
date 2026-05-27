import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Medicine } from '../../types/medicine.types';
import Alert from 'react-bootstrap/Alert';

type Props = {
  show: boolean;
  medicine: Medicine | null;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
  error?: string | null;
};

function DeleteConfirmModal({ show, medicine, onClose, onConfirm, deleting, error }: Props) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>🗑 Delete Medicine</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Are you sure you want to delete:</p>
        <div className="p-3 bg-light rounded mb-2">
          <div className="fw-semibold">{medicine?.name}</div>
          <small className="text-muted">
            {medicine?.strength ?? '—'} · {medicine?.form ?? '—'}
          </small>
          <div className="mt-1">
            <code style={{ color: '#0077b6', backgroundColor: '#e8f4fd', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
              {medicine?.atc_code}
            </code>
          </div>
        </div>
        <small className="text-muted">
          This medicine will be deactivated and no longer visible in the system.
        </small>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;