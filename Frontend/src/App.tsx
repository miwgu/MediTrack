import { Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import Login from './pages/Login';
import Medicines from './pages/Medicines';
import OrderRequest from './pages/OrderRequest';
import Orders from './pages/Orders';
import AppNavbar from './components/nav/AppNavbar';
import { OrderRequestProvider } from './context/OrderRequestContext';

function App() {

  return (
    <>
      <RoleProvider>
        <OrderRequestProvider> 
          <AppNavbar />
          <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="/medicines" element={<Medicines/>} />
              <Route path="/order-request" element={<OrderRequest />} />
              <Route path="/orders" element={<Orders/>} />
          </Routes>
        </OrderRequestProvider>
      </RoleProvider>
    </>
  );
}

export default App;