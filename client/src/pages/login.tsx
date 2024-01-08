/* eslint-disable */
// @ts-nocheck
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { registerUser, loginUser, logoutUser } from '../api/userServices';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

interface Credentials {
  username: string;
  password: string;
  email: string;
}

const Auth = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: '',
    email: '', 
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const { isLoggedIn, login, logout } = useAuth();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear existing error messages
    try {
      let userData;
      if (isLogin) {
        userData = await loginUser(credentials.username, credentials.password);
      } else {
        userData = await registerUser(credentials);
      }
      setUser(userData.data.user);
      login();
      navigate('/');
    } catch (error) {
      setError(isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  const handleBack = () => {
    navigate("/"); // Navigate to the previous page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-4 rounded-xl bg-white shadow-lg">
        <button onClick={handleBack} className="py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 mb-4">
          Back
        </button>
        {isLoggedIn ? (
          <div className="text-center">
            <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        ) : (
          <>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            {!isLogin && (
              <div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            )}
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              {isLogin ? 'Login' : 'Register'}
            </button>
          
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="w-full py-2 px-4 text-blue-500 border border-blue-500 rounded hover:bg-blue-50">
              Switch to {isLogin ? 'Register' : 'Login'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;