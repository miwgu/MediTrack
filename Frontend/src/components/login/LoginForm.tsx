import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useRole, Role } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [selected, setSelected] = useState<Role>('NURSE');
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleLogin = () => {
  setRole(selected);

  if (selected === 'WAREHOUSE') {
    navigate('/orders');
  } else {
    navigate('/medicines');
  }
};

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Login as</Form.Label>
        <Form.Select
          value={selected}
          onChange={(e) => setSelected(e.target.value as Role)}
        >
          <option value="NURSE">🏥 Nurse</option>
          <option value="PHARMACIST">💊 Pharmacist</option>
          <option value="WAREHOUSE">🏭 Warehouse</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" className="w-100" onClick={handleLogin}>
        Enter MediTrack
      </Button>
    </Form>
  );
}

export default LoginForm;