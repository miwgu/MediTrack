import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import StockBadge from './StockBadge';
import { Medicine } from '../../types/medicine.types';
import { useRole } from '../../context/RoleContext';

type Props = {
  medicines: Medicine[];
  onAddToOrder: (medicine: Medicine) => void;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: number) => void;
};

//const PAGE_SIZE = 10;

function MedicineTable({ medicines, onAddToOrder, onEdit, onDelete }: Props) {
  const { role } = useRole();

  if (medicines.length === 0) {
    return <p className="text-muted text-center mt-4">No medicines found.</p>;
  }

  //const displayed = medicines.slice(0, PAGE_SIZE);

  return (
    <>
      <div style={{ maxHeight: '520px', overflowY: 'scroll',  overflowX: 'auto', border: '1px solid #dee2e6', borderRadius: '6px', WebkitOverflowScrolling: 'touch', }}>
        <Table hover className="align-middle mb-0" style={{ minWidth: '650px' }}>
            <thead className="table-light sticky-top">
            <tr>
                <th style={{ position: 'sticky', left: 0, zIndex: 2, backgroundColor: '#f8f9fa', minWidth: '140px' }}>
                Name  {/* left fixed */}
                </th>
                <th style={{ minWidth: '120px' }}>ATC Code</th>
                <th style={{ minWidth: '100px' }}>Form</th>
                <th style={{ minWidth: '100px' }}>Strength</th>
                <th style={{ minWidth: '150px' }}>Stock Status</th>
                <th style={{ minWidth: '150px' }}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {medicines.map(med => (
                <tr key={med.id}>
                <td
                    className="fw-semibold"
                    style={{ position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'white' }}
                >
                    {med.name}
                </td>
                <td>
                    <code style={{ color: '#0077b6', backgroundColor: '#e8f4fd', padding: '2px 6px', borderRadius: '4px' }}>
                    {med.atc_code}
                    </code>
                </td>
                <td>{med.form ?? '—'}</td>
                <td>{med.strength ?? '—'}</td>
                <td>
                    <StockBadge stock={med.stock} threshold={med.threshold} />
                </td>
                <td>
                    <div className="d-flex gap-2">
                    {role === 'NURSE' && (
                        <Button size="sm" variant="outline-primary" onClick={() => onAddToOrder(med)}>
                        + Request
                        </Button>
                    )}
                    {role === 'PHARMACIST' && (
                        <>
                        <Button size="sm" variant="outline-secondary" onClick={() => onEdit(med)}>
                            Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => onDelete(med.id)}>
                            Delete
                        </Button>
                        </>
                    )}
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
      </div>
      {/* <small className="text-muted mt-2 d-block">
        Showing {displayed.length} of {medicines.length} medicines
      </small> */}
    </>
  );
}

export default MedicineTable;