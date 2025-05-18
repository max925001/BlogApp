import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(login({ username: form.username, password: form.password })).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          navigate('/');
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="w-full max-w-sm sm:max-w-md bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-primary mb-6 text-center">
          Log In
        </h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded focus:ring-2 focus:ring-blue-primary focus:outline-none"
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded focus:ring-2 focus:ring-blue-primary focus:outline-none"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-primary text-white py-3 rounded font-semibold hover:bg-blue-secondary disabled:opacity-50 transition duration-300 cursor-pointer bg-orange-500"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </div>
        <p className="text-center text-gray-400 mt-6 text-sm sm:text-base">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-accent hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
