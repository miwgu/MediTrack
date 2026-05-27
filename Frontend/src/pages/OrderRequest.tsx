import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import { useOrderRequest } from './../context/OrderRequestContext';
import { orderApi } from '../api/order.api';
import OrderRequestItem from '../components/order-request/OrderRequestItem';
import UnitSelector from '../components/order-request/UnitSelector';
import OrderSuccessModal from '../components/order-request/OrderSuccessModal';

function OrderRequest() {
  const { items, updateQuantity, removeItem, clearItems } = useOrderRequest();
  const [unit, setUnit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!unit) {
      setError('Please select your ward / unit.');
      return;
    }
    if (items.length === 0) {
      setError('No medicines in your request.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await orderApi.create({
        unit,
        items: items.map(i => ({
          medicine_id: i.medicine.id,
          quantity: i.quantity,
        })),
      });
      clearItems();
      setCreatedOrderId(created.id);    // Save order id
      setShowSuccessModal(true);        // show success modal
    } catch {
      setError('Failed to send request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '680px' }}>
        
        <OrderSuccessModal
        show={showSuccessModal}
        orderId={createdOrderId}
        onClose={() => {
            setShowSuccessModal(false);
            navigate('/orders');  // redirect to orders when modal is closed
        }}
        />
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Order Request</h2>
          <small className="text-muted">Review and send your medicine request</small>
        </div>
        <Badge bg="secondary">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <Alert variant="info">
          No medicines added yet. Go to{' '}
          <Alert.Link href="/medicines">Medicines</Alert.Link>{' '}
          to add items.
        </Alert>
      )}

      {/* Items */}
      {items.map(item => (
        <OrderRequestItem
          key={item.medicine.id}
          item={item}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
        />
      ))}

      {/* Unit selector */}
      {items.length > 0 && (
        <UnitSelector value={unit} onChange={setUnit} />
      )}

      {/* Error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Submit */}
      {items.length > 0 && (
        <div className="d-grid">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </Button>
        </div>
      )}

    </Container>
  );
}

export default OrderRequest;