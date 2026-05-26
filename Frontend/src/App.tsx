import { Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import Login from './pages/Login';
import Medicines from './pages/Medicines';
import OrderRequest from './pages/OrderRequest';
import Orders from './pages/Orders';
import AppNavbar from './components/nav/AppNavbar';

function App() {

  return (
    <>
      <RoleProvider>
        <AppNavbar />
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/medicines" element={<Medicines/>} />
            <Route path="/order-request" element={<OrderRequest />} />
            <Route path="/orders" element={<Orders/>} />
        </Routes>
      </RoleProvider>
    </>
  );
}

export default App;