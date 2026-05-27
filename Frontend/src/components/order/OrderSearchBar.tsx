import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Search } from 'react-bootstrap-icons';
import { OrderStatus } from '../../types/order.types';
import { useRole } from '../../context/RoleContext';

  const STATUS_OPTIONS: Record<string, { value: OrderStatus | ''; label: string }[]> = {
    NURSE: [
        { value: '',          label: 'All Statuses' },
        { value: 'DRAFT',     label: 'Draft' },
        { value: 'SENT',      label: 'Sent' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'DELIVERED', label: 'Delivered' },
    ],
    PHARMACIST: [
        { value: '',          label: 'All Statuses' },
        { value: 'SENT',      label: 'Sent' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'DELIVERED', label: 'Delivered' },
    ],
    WAREHOUSE: [
        { value: '',          label: 'All Statuses' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'DELIVERED', label: 'Delivered' },
    ],
    };

type Props = {
  orderId: string;
  unit: string;
  status: OrderStatus | '';
  onOrderIdChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | '') => void;
};

function OrderSearchBar({ orderId, unit, status, onOrderIdChange, onUnitChange, onStatusChange }: Props) {
    const { role } = useRole();
    const statusOptions = STATUS_OPTIONS[role ?? 'NURSE'];

    return (
    <Row className="g-2 mb-3">
      <Col xs={12} md={3}>
        <InputGroup>
          <InputGroup.Text>#</InputGroup.Text>
          <Form.Control
            type="number"
            placeholder="Order ID..."
            value={orderId}
            onChange={(e) => onOrderIdChange(e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col xs={12} md={5}>
        <InputGroup>
          <InputGroup.Text><Search /></InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by unit..."
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col xs={12} md={4}>
        <Form.Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus | '')}
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
}

export default OrderSearchBar;