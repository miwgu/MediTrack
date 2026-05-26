import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import { OrderWithItems } from '../../types/order.types';
import OrderStatusBadge from './OrderStatusBadge';
import { BoxArrowInRight } from 'react-bootstrap-icons';

type Props = {
  orders: OrderWithItems[];
};

function OrderTable({ orders }: Props) {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return <p className="text-muted text-center mt-4">No orders found.</p>;
  }

  return (
    <div style={{ height: '520px', overflowY: 'scroll', overflowX: 'auto', border: '1px solid #dee2e6', borderRadius: '6px', WebkitOverflowScrolling: 'touch' }}>
      <Table hover className="align-middle mb-0" style={{ minWidth: '600px' }}>
        <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
          <tr>
            <th style={{ minWidth: '80px' }}>Order ID</th>
            <th style={{ minWidth: '120px' }}>Unit</th>
            <th style={{ minWidth: '120px' }}>Status</th>
            <th style={{ minWidth: '150px' }}>Items</th>
            <th style={{ minWidth: '160px' }}>Created</th>
            <th style={{ minWidth: '80px' }}>Detail</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <td className="fw-semibold">#{order.id}</td>
              <td>{order.unit}</td>
              <td><OrderStatusBadge status={order.status} /></td>
              <td>
                <small className="text-muted">
                  {order.items.length} medicine{order.items.length !== 1 ? 's' : ''}
                </small>
              </td>
              <td>
                <small className="text-muted">
                  {new Date(order.created_at!).toLocaleDateString('en-SE', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </small>
              </td>
              <td>
                <BoxArrowInRight className="text-primary" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderTable;