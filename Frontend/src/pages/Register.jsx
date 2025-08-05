import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

    try {
      const res = await api.post('/register', {
        username,
        email,
        password,
      });

      toast.success('Registration successful! Redirecting to login...', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error;

      if (errorMessage === 'Email is already registered') {
        toast.error('This email is already registered. Try logging in.', {
          position: 'top-center',
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('Registration failed. Please try again.', {
          position: 'top-center',
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 border-2 mb-36 border-gray-200 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="username"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        <p className="mt-4 text-center text-gray-600"> Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
