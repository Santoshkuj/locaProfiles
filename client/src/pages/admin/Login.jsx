import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { loginUser } from '../../redux/auth/authSlice';
import {toast} from 'react-toastify'

const AdminLoginPage = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch()

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        if (email.trim() && password.trim()) {
            const response = await dispatch(loginUser({email,password}))
            if (response?.payload?.success) {
                toast.success(response?.payload?.message)
                navigate('/admin/dashboard');
                setEmail('')
                setPassword('')
            }
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }

  };

  return (
    <div className="w-full bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 sm:w-96">
        {/* Back Button */}

        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
