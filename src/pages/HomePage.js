import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Homepage = () => {
  const [beats, setBeats] = useState([]);
  const navigate = useNavigate();
  const { totalItems } = useCart();

  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'beats'));
        const beatList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBeats(beatList);
      } catch (error) {
        console.error('Error fetching beats:', error);
      }
    };

    fetchBeats();
  }, []);

  return (
    <div style={{ backgroundColor: '#121418', minHeight: '100vh', padding: '2rem', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>🎵 RabsStore</h1>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/Cart')}>
          <FaShoppingCart size={24} color="#ffffffcc" />
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: -10,
              right: -10,
              background: '#e63946',
              color: '#fff',
              borderRadius: '50%',
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Beat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {beats.map(beat => (
          <div
            key={beat.id}
            onClick={() => navigate(`/beat/${beat.id}`)}
            style={{
              backgroundColor: '#1d1f27',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s',
            }}
          >
            <img
              src={beat.image}
              alt={beat.title}
              style={{ width: '100%', height: 180, objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{beat.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#bbb' }}>{beat.genre}</p>
              <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                ₵{Number(beat.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
