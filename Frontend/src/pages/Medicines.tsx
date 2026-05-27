import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { medicineApi } from '../api/medicine.api';
import { Medicine, MedicineForm } from '../types/medicine.types';
import MedicineSearchBar from '../components/medicine/MedicineSeaechBar';
import MedicineTable from '../components/medicine/MedicineTable';
import { useRole } from '../context/RoleContext';
import { useOrderRequest } from './../context/OrderRequestContext';
import RequestToast from '../components/common/RequestToast';
import MedicineFormModal from '../components/medicine/MedicineFormModal';
import DeleteConfirmModal from '../components/medicine/DeleteConfirmModal';

function Medicines() {
  const { role } = useRole();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<MedicineForm | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMedicine, setDeletingMedicine] = useState<Medicine | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const { addItem } = useOrderRequest();
  const [toastShow, setToastShow] = useState(false);
  const [toastMedicine, setToastMedicine] = useState('');
  
  const handleAddToOrder = (medicine: Medicine) => {
    addItem(medicine)
    console.log('Add to order:', medicine);
    setToastMedicine(medicine.name);
    setToastShow(true);
  };

  //--Farmacist can delete update and add new medicines--
  const handleDeleteClick = (medicine: Medicine) => {
    setDeletingMedicine(medicine);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMedicine) return;
    setDeleting(true);
    try {
      await medicineApi.delete(deletingMedicine.id);
      setDeletingMedicine(null);
      await fetchMedicines();// 1.refetch after delete a medicine -> new medicines list
      setShowDeleteModal(false); // 2.close modal
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setDeleting(false);
    }
  };


  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingMedicine(null);
    setShowModal(true);
  };

  const handleSaved = async() => {
    await fetchMedicines();  // refetch
  };

  return (
      <Container className="py-4">
      <MedicineFormModal
      show={showModal}
      medicine={editingMedicine}
      onSaved={handleSaved}
      onClose={() => setShowModal(false)}
    />

      <DeleteConfirmModal
      show={showDeleteModal}
      medicine={deletingMedicine}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={handleDeleteConfirm}
      deleting={deleting}
      error={deleteError}
    />

      <RequestToast
      show={toastShow}
      medicineName={toastMedicine}
      onClose={() => setToastShow(false)}
    />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">💊 Medicines</h2>
          <small className="text-muted">Inventory overview</small>
        </div>
        {role === 'PHARMACIST' && (
          <Button variant="primary"　onClick={handleAddNew}>+ Add Medicine</Button>
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
          onDelete={handleDeleteClick}
        />
      )}

    </Container>
  );
}

export default Medicines;