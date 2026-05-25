import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/login/LoginForm';

function Login() {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>

          <h1 className="mb-4 text-center">Login</h1>

          <Card className="p-3 shadow-sm">
            <LoginForm
              onLogin={() => {
                navigate('/medicines'); 
              }}
            />
          </Card>

        </Col>
      </Row>
    </Container>
  );
}

export default Login;