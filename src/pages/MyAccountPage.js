import React, { useEffect, useState } from 'react';
import { getAuth, signOut, updatePassword, deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const MyAccountPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;

      const purchasesRef = collection(db, `users/${user.uid}/purchases`);
      const snapshot = await getDocs(purchasesRef);

      const purchaseData = snapshot.docs.map((docSnap) => docSnap.data());
      setPurchases(purchaseData);
      setLoading(false);
    };


    fetchPurchases();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handlePasswordChange = async () => {
    try {
      await updatePassword(user, newPassword);
      setPasswordMessage('✅ Password changed successfully');
      setNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (error) {
      setPasswordMessage(`❌ ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    try {
      await deleteUser(user);
      alert('Account deleted successfully.');
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setDeleteError('❌ Please sign out and log in again before deleting your account.');
      } else {
        setDeleteError(`❌ ${error.message}`);
      }
    }
  };

  if (!user) return <p style={styles.message}>You must be logged in to view this page.</p>;
  if (loading) return <p style={styles.message}>Loading your account...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎧 My Account</h1>

      <div style={styles.section}>
        <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={() => navigate('/')}>🏠 Homepage</button>
          <button style={{ ...styles.button, backgroundColor: '#facc15', color: '#000' }} onClick={() => setShowPasswordModal(true)}>🔒 Change Password</button>
          <button style={{ ...styles.button, backgroundColor: '#ef4444' }} onClick={handleLogout}>🚪 Logout</button>
          <button style={{ ...styles.button, backgroundColor: '#991b1b' }} onClick={() => setShowDeleteModal(true)}>🗑 Delete Account</button>
        </div>
      </div>

      <h2 style={styles.subHeader}>🛒 Your Purchased Beats</h2>
      {purchases.length === 0 ? (
        <p style={styles.message}>You haven't bought any beats yet.</p>
      ) : (
        <div style={styles.grid}>
          {purchases.map((purchase, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.beatTitle}>
                {purchase.beat?.title || purchase.title || 'Unknown Beat'}
              </h3>
              <p style={styles.details}>
                Price: ₵{purchase.beat?.price ?? purchase.price ?? 'N/A'}
              </p>
              <p style={styles.details}>
                <p>Purchased on: {new Date(purchase.purchasedAt).toLocaleDateString()}</p>
              </p>
              {purchase.beat?.downloadURL && (
                <a
                  href={purchase.beat.downloadURL}
                  download
                  style={styles.downloadButton}
                >
                  ⬇️ Download Beat
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>🔒 Change Password</h3>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
            {passwordMessage && <p style={{ color: '#facc15' }}>{passwordMessage}</p>}
            <div style={{ marginTop: 10 }}>
              <button onClick={handlePasswordChange} style={{ ...styles.button, marginRight: 10 }}>
                Confirm
              </button>
              <button onClick={() => setShowPasswordModal(false)} style={{ ...styles.button, backgroundColor: '#333' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ color: '#f87171' }}>⚠️ Are you sure?</h3>
            <p>This will permanently delete your account and all purchases. This action cannot be undone.</p>
            {deleteError && <p style={{ color: '#f87171', fontSize: 14 }}>{deleteError}</p>}
            <div style={{ marginTop: 10 }}>
              <button onClick={handleDeleteAccount} style={{ ...styles.button, backgroundColor: '#dc2626', marginRight: 10 }}>
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} style={{ ...styles.button, backgroundColor: '#333' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#121212',
    color: '#f0f0f0',
    minHeight: '100vh',
  },
  header: {
    fontSize: '2.2rem',
    marginBottom: '1rem',
    color: '#ffffff',
  },
  subHeader: {
    fontSize: '1.5rem',
    marginTop: '2rem',
    marginBottom: '1rem',
    color: '#facc15',
  },
  section: {
    backgroundColor: '#1f1f1f',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  beatTitle: {
    fontSize: '1.2rem',
    color: '#facc15',
    marginBottom: '0.5rem',
  },
  details: {
    marginBottom: '0.4rem',
    color: '#cccccc',
  },
  downloadButton: {
    marginTop: '0.5rem',
    display: 'inline-block',
    backgroundColor: '#22c55e',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#000',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  buttonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    borderRadius: '6px',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#1f1f1f',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  modal: {
    backgroundColor: '#1e1e1e',
    padding: '1.5rem',
    borderRadius: '10px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
  },
  message: {
    color: '#aaa',
    fontStyle: 'italic',
  },
};

export default MyAccountPage;
