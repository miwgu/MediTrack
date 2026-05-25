import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

type Role = 'NURSE' | 'PHARMACIST' | 'ADMIN';

type Props = {
  onLogin?: (role: Role) => void;
};

function LoginForm({ onLogin }: Props) {
  const [role, setRole] = useState<Role>('NURSE');

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Login as</Form.Label>

        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="NURSE">Nurse</option>
          <option value="PHARMACIST">Pharmacist</option>
          <option value="ADMIN">Admin</option>
        </Form.Select>
      </Form.Group>

      <Button
        variant="primary"
        type="button"
        className="w-100"
        onClick={() => {
          if (onLogin) onLogin(role);
        }}
      >
        Enter MediTrack
      </Button>
    </Form>
  );
}

export default LoginForm;