import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const getFriendlyError = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Please enter a valid email.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      navigate('/');
    } catch (error) {
      const message = getFriendlyError(error.code);
      setErrorMsg(message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={styles.title}>Create Your Account</h2>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={styles.input}
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ ...styles.input, marginBottom: 0 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            style={styles.toggleButton}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button type="submit" style={styles.button}>Sign Up</button>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign In</Link>
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
    background: '#f8f9fa',
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
    width: '100%',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  toggleButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: 14,
    padding: 0,
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
  footerText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  error: {
    color: '#d9534f',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  }
};

export default Signup;
