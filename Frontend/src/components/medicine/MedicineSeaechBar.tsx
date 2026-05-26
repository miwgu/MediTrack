import { Search } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { MedicineForm } from '../../types/medicine.types';

const MEDICINE_FORMS: MedicineForm[] = ['tablet', 'capsule', 'injection', 'inhalation'];

type Props = {
  search: string;
  form: MedicineForm | '';
  onSearchChange: (value: string) => void;
  onFormChange: (value: MedicineForm | '') => void;
};

function MedicineSearchBar({ search, form, onSearchChange, onFormChange }: Props) {
  return (
    <Row className="g-2 mb-3">
      <Col xs={12} md={8}>
        <InputGroup>
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by name or ATC code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col xs={12} md={4}>
        <Form.Select
          value={form}
          onChange={(e) => onFormChange(e.target.value as MedicineForm | '')}
        >
          <option value="">All Forms</option>
          {MEDICINE_FORMS.map(f => (
            <option key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
}

export default MedicineSearchBar;