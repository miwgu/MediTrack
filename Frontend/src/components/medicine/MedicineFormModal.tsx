import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Medicine, MedicineForm } from '../../types/medicine.types';
import { medicineApi } from '../../api/medicine.api';

const MEDICINE_FORMS: MedicineForm[] = ['tablet', 'capsule', 'injection', 'inhalation'];

type Props = {
  show: boolean;
  medicine?: Medicine | null;
  onClose: () => void;
  onSaved: () => void;
};

type FormData = {
  name: string;
  atc_code: string;
  form: MedicineForm | '';
  strength: string;
  stock: string;
  threshold: string;
};

const EMPTY_FORM: FormData = {
  name: '',
  atc_code: '',
  form: '',
  strength: '',
  stock: '0',
  threshold: '10',
};

function MedicineFormModal({ show, medicine, onClose, onSaved }: Props) {
  const isEdit = !!medicine;
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (medicine) {
      setFormData({
        name:      medicine.name,
        atc_code:  medicine.atc_code,
        form: (medicine.form ?? '') as MedicineForm | '',
        strength:  medicine.strength ?? '',
        stock:     String(medicine.stock),
        threshold: String(medicine.threshold),
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
    setApiError(null);
  }, [medicine, show]);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim())     newErrors.name = 'Name is required';
    if (!formData.atc_code.trim()) newErrors.atc_code = 'ATC code is required';
    if (Number(formData.stock) < 0)     newErrors.stock = 'Stock must be 0 or more';
    if (Number(formData.threshold) < 0) newErrors.threshold = 'Threshold must be 0 or more';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value as MedicineForm | '' }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    setApiError(null);

    try {
      const payload = {
        name:      formData.name.trim(),
        atc_code:  formData.atc_code.trim().toUpperCase(),
        form:      formData.form || null,
        strength:  formData.strength.trim() || null,
        stock:     Number(formData.stock),
        threshold: Number(formData.threshold),
      };

      if (isEdit && medicine) {
        await medicineApi.update(medicine.id, payload);
      } else {
        await medicineApi.create(payload);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setApiError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? '✏️ Edit Medicine' : '➕ Add Medicine'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {apiError && <Alert variant="danger">{apiError}</Alert>}

        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            isInvalid={!!errors.name}
            placeholder="e.g. Paracetamol"
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        {/* ATC Code */}
        <Form.Group className="mb-3">
          <Form.Label>ATC Code <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            value={formData.atc_code}
            onChange={(e) => handleChange('atc_code', e.target.value.toUpperCase())}
            isInvalid={!!errors.atc_code}
            placeholder="e.g. N02BE01"
          />
          <Form.Control.Feedback type="invalid">{errors.atc_code}</Form.Control.Feedback>
        </Form.Group>

        {/* Form */}
        <Form.Group className="mb-3">
          <Form.Label>Form</Form.Label>
          <Form.Select
            value={formData.form}
            onChange={(e) => handleChange('form', e.target.value)}
          >
            <option value="">Select form...</option>
            {MEDICINE_FORMS.map(f => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Strength */}
        <Form.Group className="mb-3">
          <Form.Label>Strength</Form.Label>
          <Form.Control
            type="text"
            value={formData.strength}
            onChange={(e) => handleChange('strength', e.target.value)}
            placeholder="e.g. 500mg"
          />
        </Form.Group>

        {/* Stock & Threshold */}
        <div className="d-flex gap-3">
          <Form.Group className="mb-3 flex-fill">
            <Form.Label>Stock <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              isInvalid={!!errors.stock}
            />
            <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 flex-fill">
            <Form.Label>Threshold <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={formData.threshold}
              onChange={(e) => handleChange('threshold', e.target.value)}
              isInvalid={!!errors.threshold}
            />
            <Form.Control.Feedback type="invalid">{errors.threshold}</Form.Control.Feedback>
          </Form.Group>
        </div>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Medicine'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MedicineFormModal;