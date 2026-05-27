import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import { useRole, Role } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { useOrderRequest } from '../../context/OrderRequestContext';

const ROLE_ICONS: Record<Role, string> = {
  NURSE: '🏥',
  PHARMACIST: '💊',
  WAREHOUSE: '🏭',
};

function AppNavbar() {
  const { role, setRole, clearRole } = useRole();
  const navigate = useNavigate();
  const { items, clearItems } = useOrderRequest();

  const homePath =
  role === 'WAREHOUSE'
    ? '/orders'
    : '/medicines';

  return (
    <Navbar bg="light" expand="lg" className="border-bottom" style={{ position: 'sticky', top: 0, zIndex: 1030 }}>
      <Container>
        <Navbar.Brand href={homePath}>💊 MediTrack</Navbar.Brand>

        <Nav className="me-auto">
          {role !== 'WAREHOUSE' && (
            <Nav.Link href="/medicines">Medicines</Nav.Link>
          )}
          <Nav.Link href="/orders">Orders</Nav.Link>
          {role === 'NURSE' && (
            <Nav.Link href="/order-request">
              Order Request{' '}
              {items.length > 0 && (
                <Badge bg="primary" pill>{items.length}</Badge>
              )}
            </Nav.Link>
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
              <NavDropdown.Item onClick={() => {
                  clearItems()
                  clearRole();
                  navigate('/');
                }}>
                Logout</NavDropdown.Item>
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