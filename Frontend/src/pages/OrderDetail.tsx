import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { ArrowLeft } from 'react-bootstrap-icons';
import { orderApi } from '../api/order.api';
import { OrderWithItems } from '../types/order.types';
import OrderDetailHeader from '../components/order/OrderDetailHeader';
import OrderItemsTable from '../components/order/OrderItemsTable';
import OrderActionButton from '../components/order/OrderActionButton';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderApi.getById(Number(id));
        setOrder(data);
      } catch {
        setError('Failed to load order.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'CONFIRMED' | 'DELIVERED') => {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await orderApi.updateStatus(order.id, newStatus);
      setOrder({ ...updated, items: order.items });
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Container className="py-4"><p className="text-muted">Loading...</p></Container>;
  if (error) return <Container className="py-4"><Alert variant="danger">{error}</Alert></Container>;
  if (!order) return null;

  return (
    <Container className="py-4" style={{ maxWidth: '720px' }}>

      <Button variant="link" className="text-muted ps-0 mb-3" onClick={() => navigate(-1)}>
        <ArrowLeft className="me-1" /> Back to Orders
      </Button>

      <OrderDetailHeader order={order} />
      <OrderItemsTable items={order.items} />
      <OrderActionButton order={order} onUpdate={handleStatusUpdate} updating={updating} />

    </Container>
  );
}

export default OrderDetail;