import Button from 'react-bootstrap/Button';
import { OrderWithItems } from '../../types/order.types';
import { useRole } from '../../context/RoleContext';

type Props = {
  order: OrderWithItems;
  onUpdate: (status: 'CONFIRMED' | 'DELIVERED') => void;
  updating: boolean;
};

function OrderActionButton({ order, onUpdate, updating }: Props) {
  const { role } = useRole();

  if (role === 'PHARMACIST' && order.status === 'SENT') {
    return (
      <div className="d-grid">
        <Button
          variant="warning"
          size="lg"
          onClick={() => onUpdate('CONFIRMED')}
          disabled={updating}
        >
          {updating ? 'Updating...' : '✓ Confirm Order'}
        </Button>
      </div>
    );
  }

  if (role === 'WAREHOUSE' && order.status === 'CONFIRMED') {
    return (
      <div className="d-grid">
        <Button
          variant="success"
          size="lg"
          onClick={() => onUpdate('DELIVERED')}
          disabled={updating}
        >
          {updating ? 'Updating...' : '🚚 Mark as Delivered'}
        </Button>
      </div>
    );
  }

  return null;
}

export default OrderActionButton;