import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

type Props = {
  show: boolean;
  orderId: number | null;
  onClose: () => void;
};

function OrderSuccessModal({ show, orderId, onClose }: Props) {
  const navigate = useNavigate();

  const handleViewOrder = () => {
    onClose();
    navigate(`/orders/${orderId}`);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>✅ Order Sent Successfully</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <h5 className="mt-2">Order #{orderId}</h5>
        <p className="text-muted">
          Your request has been sent to the pharmacist for review.
          You can track the status of your order in the Orders page.
        </p>
      </Modal.Body>

      <Modal.Footer className="d-flex gap-2">
        <Button variant="outline-secondary" onClick={onClose} className="flex-fill">
          Close
        </Button>
        <Button variant="primary" onClick={handleViewOrder} className="flex-fill">
          View Order Detail
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrderSuccessModal;