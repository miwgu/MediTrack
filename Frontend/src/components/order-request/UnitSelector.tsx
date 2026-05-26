import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

const UNITS = ['ICU', 'ER', 'WARD A', 'WARD B', 'WARD C'];

type Props = {
  value: string;
  onChange: (unit: string) => void;
};

function UnitSelector({ value, onChange }: Props) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Form.Group>
          <Form.Label className="fw-semibold">Ward / Unit</Form.Label>
          <Form.Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select your ward...</option>
            {UNITS.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default UnitSelector;