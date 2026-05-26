import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { medicineApi } from '../api/medicine.api';
import { Medicine, MedicineForm } from '../types/medicine.types';
import MedicineSearchBar from '../components/medicine/MedicineSeaechBar';
import MedicineTable from '../components/medicine/MedicineTable';
import { useRole } from '../context/RoleContext';

function Medicines() {
  const { role } = useRole();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<MedicineForm | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicineApi.getAll({
        search: search || undefined,
        form: form || undefined,
      });
      setMedicines(data);
    } catch {
      setError('Failed to load medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, form]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleAddToOrder = (medicine: Medicine) => {
    // Cart logic — next step
    console.log('Add to order:', medicine);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    await medicineApi.delete(id);
    fetchMedicines();
  };

  const handleEdit = (medicine: Medicine) => {
    // Modal logic — next step
    console.log('Edit:', medicine);
  };

  return (
    <Container className="py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">💊 Medicines</h2>
          <small className="text-muted">Inventory overview</small>
        </div>
        {role === 'PHARMACIST' && (
          <Button variant="primary">+ Add Medicine</Button>
        )}
      </div>

      {/* Search */}
      <MedicineSearchBar
        search={search}
        form={form}
        onSearchChange={setSearch}
        onFormChange={setForm}
      />

      {/* States */}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <p className="text-muted">Loading...</p>}

      {/* Table */}
      {!loading && (
        <MedicineTable
          medicines={medicines}
          onAddToOrder={handleAddToOrder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

    </Container>
  );
}

export default Medicines;