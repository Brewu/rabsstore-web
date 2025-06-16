import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // ✅ import cart hook

const Success = () => {
  const [purchasedBeats, setPurchasedBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const { clearCart } = useCart(); // ✅ clear cart

  useEffect(() => {
    const fetchPurchasedBeats = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(collection(db, `users/${user.uid}/purchases`));
        const items = snapshot.docs.map(doc => doc.data());
        setPurchasedBeats(items);
        clearCart(); // ✅ clear cart after successful purchase

      } catch (err) {
        console.error('Failed to load purchases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedBeats();
  }, [user,clearCart]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎧 My Purchased Beats</h2>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : purchasedBeats.length === 0 ? (
        <p style={styles.empty}>You haven’t purchased any beats yet.</p>
      ) : (
        <div style={styles.grid}>
          {purchasedBeats.map((beat, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.title}>{beat.title}</h3>
              <div style={styles.infoRow}>
                <span style={styles.label}>🔗 Telegram Link:</span>
                <a href={beat.telegramlink} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  {beat.telegramlink}
                </a>
                <button onClick={() => copyToClipboard(beat.telegramlink)} style={styles.copyBtn}>📋</button>
              </div>
              {beat.zipPassword && (
                <div style={styles.infoRow}>
                  <span style={styles.label}>🛡️ ZIP Password:</span>
                  <code style={styles.code}>{beat.zipPassword}</code>
                  <button onClick={() => copyToClipboard(beat.zipPassword)} style={styles.copyBtn}>📋</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem 1.5rem',
    maxWidth: 960,
    margin: '0 auto',
    color: '#f1f1f1',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#121418',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
    fontWeight: 700,
    color: '#4ecdc4',
  },
  loading: {
    textAlign: 'center',
    color: '#aaa',
  },
  empty: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#ccc',
  },
  grid: {
    display: 'grid',
    gap: '1.8rem',
  },
  card: {
    backgroundColor: '#1d1f27',
    padding: '1.5rem',
    borderRadius: 16,
    boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
    transition: 'transform 0.2s ease',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.8rem',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 500,
    color: '#aaa',
    minWidth: 110,
  },
  link: {
    color: '#4ecdc4',
    wordBreak: 'break-all',
    textDecoration: 'underline',
    fontSize: '0.95rem',
  },
  code: {
    background: '#2c2f3c',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: '#fff',
  },
  copyBtn: {
    border: 'none',
    background: '#2b6cb0',
    color: '#fff',
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  backBtn: {
    background: '#4ecdc4',
    padding: '0.7rem 1.6rem',
    border: 'none',
    borderRadius: '10px',
    color: '#121418',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'background 0.2s ease',
  },
};

export default Success;
