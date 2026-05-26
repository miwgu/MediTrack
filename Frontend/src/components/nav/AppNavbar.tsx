import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import { useRole, Role } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';

const ROLE_ICONS: Record<Role, string> = {
  NURSE: '🏥',
  PHARMACIST: '💊',
  WAREHOUSE: '🏭',
};

function AppNavbar() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand href="/medicines">💊 MediTrack</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link href="/medicines">Medicines</Nav.Link>
          <Nav.Link href="/orders">Orders</Nav.Link>
          {role === 'WAREHOUSE' && (
            <Nav.Link href="/warehouse">Warehouse</Nav.Link>
          )}
          {role === 'NURSE' && (
            <Nav.Link href="/cart">Cart</Nav.Link>
          )}
        </Nav>

        <Nav className="ms-auto">
          {role ? (
            <NavDropdown
              title={<>{ROLE_ICONS[role]} <Badge bg="secondary">{role}</Badge></>}
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Header>Switch Role (Mock)</NavDropdown.Header>
              <NavDropdown.Item onClick={() => setRole('NURSE')}>🏥 Nurse</NavDropdown.Item>
              <NavDropdown.Item onClick={() => setRole('PHARMACIST')}>💊 Pharmacist</NavDropdown.Item>
              <NavDropdown.Item onClick={() => setRole('WAREHOUSE')}>🏭 Warehouse</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate('/')}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link href="/">Login</Nav.Link>
          )}
        </Nav>

      </Container>
    </Navbar>
  );
}

export default AppNavbar;