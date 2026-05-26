import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

type Props = {
  show: boolean;
  medicineName: string;
  onClose: () => void;
};

function RequestToast({ show, medicineName, onClose }: Props) {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1100 }}>
      <Toast show={show} onClose={onClose} delay={2500} autohide bg="success">
        <Toast.Header>
          <strong className="me-auto">✓ Added to Order Request</strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          {medicineName} has been added.
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default RequestToast;