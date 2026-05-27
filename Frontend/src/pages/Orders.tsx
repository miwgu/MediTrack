import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { orderApi } from '../api/order.api';
import { OrderWithItems, OrderStatus } from '../types/order.types';
import OrderTable from '../components/order/OrderTable';
import OrderSearchBar from '../components/order/OrderSearchBar';
import { useRole } from '../context/RoleContext';

function Orders() {
  const { role } = useRole();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [orderId, setOrderId] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFilteredOrders = (orders: OrderWithItems[]) => {
    switch (role) {
      case 'NURSE':
        return orders; // All status
      case 'PHARMACIST':
        return orders.filter(o => o.status !== 'DRAFT');
      case 'WAREHOUSE':
        return orders.filter(o => o.status === 'CONFIRMED' || o.status === 'DELIVERED');
      default:
        return orders;
    }
 };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getAll({
        unit: unit || undefined,
        status: status || undefined,
        id: orderId ? Number(orderId) : undefined,
      });

      setOrders(getFilteredOrders(data));

    } catch {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [unit, status, orderId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Container className="py-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-0">Orders</h2>
        <small className="text-muted">
          {role === 'NURSE'      && 'Your unit order history'}
          {role === 'PHARMACIST' && 'All orders — confirm pending requests'}
          {role === 'WAREHOUSE'  && 'All orders — mark as delivered'}
        </small>
      </div>

      {/* Search */}
      <OrderSearchBar
        orderId={orderId}
        unit={unit}
        status={status}
        onOrderIdChange={setOrderId}
        onUnitChange={setUnit}
        onStatusChange={setStatus}
      />

      {/* States */}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <p className="text-muted">Loading...</p>}

      {/* Table */}
      {!loading && (
        <OrderTable orders={orders} />
      )}

    </Container>
  );
}

export default Orders;