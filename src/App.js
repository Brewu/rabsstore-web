import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import SuccessScreen from './pages/SuccessSCreen';
import Purchases from './pages/Purchases';
import Homepage from './pages/HomePage';
import ForgotPassword from './pages/ForgottenPassword';
import { CartProvider } from './context/CartContext';
import CartScreen from './pages/CartScreen';
import MyAccountPage from './pages/MyAccountPage';
const cors = require('cors');

// Allow all origins (for development)

// OR restrict to just your frontend
// app.use(cors({ origin: 'http://localhost:3000' }));

function App() {
  return (

    <CartProvider>

      <Routes>
        <Route path="/" element={
          <Homepage />
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Cart" element={<CartScreen />} />
        <Route path="/Account" element={<MyAccountPage />} />
        <Route path="/Success" element={<SuccessScreen />} />
        <Route path="/beat/:id" element={<Home />} />  // dynamic beat detail page

      </Routes>
    </CartProvider>

  );
}

export default App;
