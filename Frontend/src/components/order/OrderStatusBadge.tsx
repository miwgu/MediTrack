import Badge from 'react-bootstrap/Badge';
import { OrderStatus } from '../../types/order.types';

type Props = {
  status: OrderStatus;
};

const STATUS_CONFIG: Record<OrderStatus, { bg: string; label: string }> = {
  DRAFT:     { bg: 'secondary', label: 'Draft' },
  SENT:      { bg: 'primary',   label: 'Sent' },
  CONFIRMED: { bg: 'warning',   label: 'Confirmed' },
  DELIVERED: { bg: 'success',   label: 'Delivered' },
};

function OrderStatusBadge({ status }: Props) {
  const { bg, label } = STATUS_CONFIG[status];
  return (
   <Badge 
    bg={bg} 
    text={bg === 'warning' ? 'dark' : undefined}
    className="d-inline-flex justify-content-center align-items-center"
      style={{
        width: '110px',
        height: '28px',
      }}
    >
        {label}
    </Badge>
  );
}

export default OrderStatusBadge;