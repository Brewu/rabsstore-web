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
          // Example inside a loop:
          <div onClick={() => navigate(`/beat/${beat.id}`)}>
            <h3>{beat.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
