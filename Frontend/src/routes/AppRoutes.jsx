import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Account from '../pages/Account';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth-check')
      .then(res => setIsAuthenticated(res.data.isAuthenticated))
      .catch(err => console.error('Auth check failed:', err));
  }, []);

  const handleLogout = () => {
    api.post('/logout')
      .then(() => {
        setIsAuthenticated(false);
        navigate('/login', {
          state: { toastMessage: 'You’ve been logged out successfully.' }
        });
      })
      .catch(err => console.error('Logout failed:', err));
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <main className='flex flex-col min-h-screen'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList isAuthenticated={isAuthenticated} />} />
          <Route path="/products/:id" element={<ProductDetail isAuthenticated={isAuthenticated} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRoutes;
