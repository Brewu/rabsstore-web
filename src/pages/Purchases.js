import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
      } else {
        try {
          // Fetch user's purchases
          const q = query(collection(db, 'purchases'), where('userId', '==', user.uid));
          const snapshot = await getDocs(q);
          const purchaseData = snapshot.docs.map(doc => doc.data());
          setPurchases(purchaseData);

          // Fetch available beats
          const beatsSnapshot = await getDocs(collection(db, 'beats'));
          const allBeats = beatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBeats(allBeats);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <p style={{ padding: 30, color: '#fff' }}>Loading your purchases...</p>;

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      padding: '2rem',
      backgroundColor: '#121418',
      color: '#f1f1f1',
      minHeight: '100vh',
    }}>
      {/* Purchased Beats */}
      <h2 style={{
        fontSize: '1.6rem',
        marginBottom: '2rem',
        textAlign: 'center',
        fontWeight: 700
      }}>
        🎧 Your Purchased Beats
      </h2>

      {purchases.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>You haven't purchased any beats yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem'
          }}
        >
          {purchases.map((purchase, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1d1f27',
                borderRadius: 14,
                padding: '1rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              <img
                src={purchase.imageUrl}
                alt={purchase.title}
                style={{
                  width: '100%',
                  height: 160,
                  objectFit: 'cover',
                  borderRadius: 10,
                  marginBottom: 12
                }}
              />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>{purchase.title}</h3>
              <p style={{ color: '#ccc', fontSize: '0.95rem' }}>Genre: {purchase.genre}</p>
              <a
                href={purchase.audioUrl}
                download
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  padding: '0.6rem 1.2rem',
                  backgroundColor: '#ff5252',
                  color: '#fff',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                ⬇️ Download
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Browse More Beats */}
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontWeight: 700
      }}>
        🔍 Browse More Beats
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {beats.map((beat) => (
          <div
            key={beat.id}
            onClick={() => navigate('/Home', { state: { beat } })}
            style={{
              backgroundColor: '#1d1f27',
              borderRadius: 14,
              padding: '1rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={beat.image}
              alt={beat.title}
              style={{
                width: '100%',
                height: 160,
                objectFit: 'cover',
                borderRadius: 10,
                marginBottom: 12
              }}
            />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{beat.title}</h3>
            <p style={{ color: '#ccc' }}>{beat.genre}</p>
            <p style={{ fontWeight: 'bold', color: '#fefefe' }}>₵{Number(beat.price).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '5rem',
        textAlign: 'center',
        color: '#555',
        fontSize: '0.85rem'
      }}>
        <p>&copy; {new Date().getFullYear()} RabsStore. Keep vibing 🎶</p>
      </footer>
    </div>
  );
};

export default Purchases;
