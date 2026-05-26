import Card from 'react-bootstrap/Card';
import { OrderWithItems } from '../../types/order.types';
import OrderStatusBadge from './OrderStatusBadge';

type Props = {
  order: OrderWithItems;
};

function OrderDetailHeader({ order }: Props) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h5 className="mb-1">Order #{order.id}</h5>
            <div className="text-muted mb-1">
              <small>Unit: <strong>{order.unit}</strong></small>
            </div>
            <div className="text-muted">
              <small>
                Created: {new Date(order.created_at!).toLocaleDateString('en-SE', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </small>
            </div>
            {order.updated_at && order.updated_at !== order.created_at && (
            <div className="text-muted">
              <small>
                  Last updated: {new Date(order.updated_at).toLocaleDateString('en-SE', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </small>
            </div>
            )}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </Card.Body>
    </Card>
  );
}

export default OrderDetailHeader;