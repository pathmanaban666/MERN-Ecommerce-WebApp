import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toastMessage === 'Please login to purchase item') {
      toast.error(location.state.toastMessage, {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      });
    }
    if (location.state?.toastMessage === 'You’ve been logged out successfully.') {
      toast.success(location.state.toastMessage, {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/login', {
        email,
        password,
      });

      if (res.status === 200) {
        toast.success('Login successful! Redirecting to home page...', {
          position: 'top-center',
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });

        setIsAuthenticated(true);

        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      toast.error('Invalid Crendentials.', {
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 border-2 mb-36 border-gray-200 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>
         <p className="mt-4 text-center text-gray-600"> Don't have an account?{' '}
         <Link to="/register" className="text-blue-600 hover:underline">Create Account</Link>
         </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
