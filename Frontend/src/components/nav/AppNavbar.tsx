import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>

        {/* ロゴ */}
        <Navbar.Brand href="/">
          MediTrack
        </Navbar.Brand>

        {/* 右側 */}
        <Nav className="ms-auto">
          <NavDropdown title="👤 User" id="user-dropdown" align="end">

            <NavDropdown.Item>
              Profile
            </NavDropdown.Item>

            <NavDropdown.Item>
              Settings
            </NavDropdown.Item>

            <NavDropdown.Divider />

            <NavDropdown.Item>
              Logout
            </NavDropdown.Item>

          </NavDropdown>
        </Nav>

      </Container>
    </Navbar>
  );
}

export default AppNavbar;