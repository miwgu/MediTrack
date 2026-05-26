import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Search } from 'react-bootstrap-icons';
import { orderApi } from '../api/order.api';
import { OrderWithItems, OrderStatus } from '../types/order.types';
import OrderTable from '../components/order/OrderTable';
import { useRole } from '../context/RoleContext';

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '',          label: 'All Statuses' },
  { value: 'SENT',      label: 'Sent' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'DELIVERED', label: 'Delivered' },
];

function Orders() {
  const { role } = useRole();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getAll({
        unit: unit || undefined,
        status: status || undefined,
      });
      setOrders(data);
    } catch {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [unit, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Container className="py-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-0">📋 Orders</h2>
        <small className="text-muted">
          {role === 'NURSE' && 'Your unit order history'}
          {role === 'PHARMACIST' && 'All orders — confirm pending requests'}
          {role === 'WAREHOUSE' && 'All orders — mark as delivered'}
        </small>
      </div>

      {/* Filters */}
      <Row className="g-2 mb-3">
        <Col xs={12} md={8}>
          <InputGroup>
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by unit..."
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={12} md={4}>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus | '')}
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

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