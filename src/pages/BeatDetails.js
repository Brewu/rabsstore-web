import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BeatDetails = () => {
  const { id } = useParams();
  const [beat, setBeat] = useState(null);

  useEffect(() => {
    const fetchBeat = async () => {
      try {
        const docRef = doc(db, 'beats', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBeat({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such beat!');
        }
      } catch (err) {
        console.error('Error fetching beat details:', err);
      }
    };

    fetchBeat();
  }, [id]);

  if (!beat) return <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>;

  const shareUrl = `${window.location.origin}/beat/${beat.id}`;

  return (
    <div style={{
      padding: '2rem',
      maxWidth: 800,
      margin: '0 auto',
      color: '#f1f1f1',
      backgroundColor: '#121418',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1>{beat.title}</h1>
      <img src={beat.image} alt={beat.title} style={{ width: '100%', borderRadius: 10 }} />
      <p><strong>Genre:</strong> {beat.genre}</p>
      <p><strong>Price:</strong> ₵{beat.price}</p>
      {beat.discount > 0 && (
        <p style={{ color: '#4ecdc4' }}>Discount: {beat.discount}%</p>
      )}
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          value={shareUrl}
          readOnly
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: 6,
            border: '1px solid #444',
            background: '#1e1e2f',
            color: '#f1f1f1'
          }}
        />
        <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.5rem' }}>
          Copy and share this link.
        </p>
      </div>
    </div>
  );
};

export default BeatDetails;
