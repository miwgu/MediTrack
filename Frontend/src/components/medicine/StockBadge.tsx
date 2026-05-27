import Badge from 'react-bootstrap/Badge';
import { ExclamationTriangle, CheckCircle } from 'react-bootstrap-icons';

type Props = {
  stock: number;
  threshold: number;
};

function StockBadge({ stock, threshold }: Props) {
  const isLow = stock < threshold;

  return isLow ? (
    <Badge
      bg="warning"
      text="dark"
      className="d-inline-flex justify-content-center align-items-center"
      style={{
        minWidth: '140px',
        height: '30px',
      }}
    >
      <ExclamationTriangle className="me-1" />
      Low Stock ({stock})
    </Badge>
  ) : (
    <Badge
      bg="success"
      className="d-inline-flex justify-content-center align-items-center"
      style={{
        minWidth: '140px',
        height: '30px',
      }}
    >
      <CheckCircle className="me-1" />
      In Stock ({stock})
    </Badge>
  );
}

export default StockBadge;