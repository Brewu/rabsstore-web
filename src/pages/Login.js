import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      let message = 'Something went wrong. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          message = 'This user has been disabled.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;
        case 'auth/invalid-credential':
          message = 'Incorrect email or password.';
          break;
        default:
          message = 'Login failed. Please try again.';
      }
      setErrorMessage(message);
    }


  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Welcome Back</h2>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />

        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ ...styles.input, paddingRight: 40 }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#007bff',
              fontSize: 14
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>

        {errorMessage && (
          <div style={{ color: 'red', textAlign: 'center', fontSize: 14 }}>
            {errorMessage}
          </div>
        )}

        <button type="submit" style={styles.button}>Login</button>
        <p style={{ textAlign: 'center', marginTop: 10 }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign Up
          </span>
        </p>

        <p style={{ textAlign: 'center', marginTop: 5 }}>
          <span
            onClick={() => navigate('/forgot-password')}
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Forgot password?
          </span>
        </p>

      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f1f3f5',
    padding: 20,
  },
  form: {
    background: '#fff',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    maxWidth: 400,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 16,
  },
  button: {
    background: '#000',
    color: '#fff',
    padding: 12,
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default Login;
