import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import { OrderItem } from '../../types/order.types';
import { getMedicineUnit } from '../medicine/medicineUnit';
import { MedicineForm } from '../../types/medicine.types';
import { GiMedicines } from "react-icons/gi";

type Props = {
  items: OrderItem[];
};

function OrderItemsTable({ items }: Props) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header className="fw-semibold"><GiMedicines /> Medicines</Card.Header>
      <Card.Body className="p-0">
        <Table className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>ATC Code</th>
              <th>Form</th>
              <th>Strength</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="fw-semibold">{item.medicine_name}</td>
                <td>
                  <code style={{ color: '#0077b6', backgroundColor: '#e8f4fd', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {item.medicine_atc_code}
                  </code>
                </td>
                <td>{item.medicine_form ?? '—'}</td>
                <td>{item.medicine_strength ?? '—'}</td>
                <td>
                  {item.quantity} {getMedicineUnit(item.medicine_form as MedicineForm ?? null)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default OrderItemsTable;