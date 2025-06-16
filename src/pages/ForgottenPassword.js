import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset link sent! Check your email.');
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '60px auto',
      padding: '40px 30px',
      border: '1px solid #eaeaea',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      backgroundColor: '#fff',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: 20 }}>🔐 Forgot Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: 16,
            fontSize: 16
          }}
        />
        <button
          type="submit"
          style={{
            padding: 12,
            width: '100%',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Send Reset Link
        </button>
      </form>

      {message && (
        <p style={{ color: 'green', marginTop: 16 }}>{message}</p>
      )}
      {error && (
        <p style={{ color: 'red', marginTop: 16 }}>{error}</p>
      )}
    </div>
  );
};

export default ForgotPassword;
