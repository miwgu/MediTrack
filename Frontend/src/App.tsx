import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Medicines from './pages/Medicines';
import Orders from './pages/Orders';
import AppNavbar from './components/nav/AppNavbar';

function App() {

  return (
    <>
      <AppNavbar/>

      <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/medicines" element={<Medicines/>} />
          <Route path="/orders" element={<Orders/>} />
      </Routes>
    </>
  );
}

export default App;