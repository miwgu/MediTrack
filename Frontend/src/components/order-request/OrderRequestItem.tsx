import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';
import { RequestItem } from '../../context/OrderRequestContext';
import { getMedicineUnit } from '../medicine/medicineUnit';
import { MedicineForm } from '../../types/medicine.types';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';

type Props = {
  item: RequestItem;
  onUpdateQuantity: (medicineId: number, quantity: number) => void;
  onRemove: (medicineId: number) => void;
};

function OrderRequestItem({ item, onUpdateQuantity, onRemove }: Props) {
  const { medicine, quantity } = item;
  const [inputValue, setInputValue] = useState(String(quantity));

    useEffect(() => {
      setInputValue(String(quantity));
    }, [quantity]);

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center gap-2">

          {/* Medicine info */}
          <div style={{ minWidth: 0 }}>  
            <div className="fw-semibold text-truncate">{medicine.name}</div>
            <small className="text-muted">
              {medicine.strength ?? '—'} · {medicine.form ?? '—'}
            </small>
            <div className="mt-1">
              <code style={{ color: '#0077b6', backgroundColor: '#e8f4fd', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                {medicine.atc_code}
              </code>
            </div>
          </div>

          {/* Quantity control */}
          <div className="d-flex align-items-center gap-2" 
                style={{ width: '220px',
                  justifyContent: 'flex-end',
                  flexShrink: 0, 
                }}>
              <Form.Control
                type="number"
                min={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => {
                  const val = parseInt(inputValue);
                  if (!isNaN(val) && val > 0) {
                    onUpdateQuantity(medicine.id, val);
                  } else {
                    setInputValue(String(quantity));
                  }
                }}
                style={{ 
                  width: '70px', 
                  textAlign: 'center' 
                }}
              />
              <small
                className="text-muted text-start"
                style={{
                  width: '70px',
                  display: 'inline-block',
                }}
              >
                {getMedicineUnit(medicine.form as MedicineForm | null)}
              </small>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => onRemove(medicine.id)}
              >
                <Trash />
              </Button>
          </div>

        </div>
      </Card.Body>
    </Card>
  );
}

export default OrderRequestItem;