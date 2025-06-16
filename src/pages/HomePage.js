import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'beats'));
        const fetchedBeats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBeats(fetchedBeats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching beats:', error);
        setLoading(false);
      }
    };

    fetchBeats();
  }, []);

  if (loading) return <p style={{ color: '#fff', padding: '2rem' }}>Loading beats...</p>;

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#121418',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>
        🎶 Explore Beats
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
      }}>
        {beats.map(beat => (
          <div
            key={beat.id}
            style={{
              backgroundColor: '#1e1f25',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            <img
              src={beat.image}
              alt={beat.title}
              style={{
                width: '100%',
                height: 150,
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.3rem' }}>{beat.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#bbb' }}>{beat.genre}</p>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>₵{beat.price}</p>
              <Link
                to={`/beat/${beat.id}`}
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontWeight: 600
                }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
