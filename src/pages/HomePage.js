import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [beats, setBeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeats = async () => {
      const querySnapshot = await getDocs(collection(db, 'beats'));
      const beatsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBeats(beatsData);
    };
    fetchBeats();
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#121418', color: '#fff' }}>
      <h1>🎵 RabsStore</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {beats.map((beat) => (
          <div
            key={beat.id}
            onClick={() => navigate(`/beat/${beat.id}`)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#1d1f27',
              padding: '1rem',
              borderRadius: 10,
              width: 250,
            }}
          >
            <img
              src={beat.image}
              alt={beat.title}
              style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6 }}
            />
            <h3>{beat.title}</h3>
            <p>{beat.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
