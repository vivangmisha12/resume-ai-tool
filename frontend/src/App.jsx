// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/actions/user';

import Register from './pages/Register';
import Login from './pages/Login';
import Test from './components/test';
import ProtectedRoute from './utils/ProtectedRoutes';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Result from './pages/Result';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) return <div className="min-h-screen flex justify-center items-center">Checking login...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/Result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;