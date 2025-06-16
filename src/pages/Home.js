import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { FaShoppingCart, FaBars, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // adjust if needed

const BeatDetails = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, totalItems } = useCart();

  const auth = getAuth();
  const user = auth.currentUser;
  const { id } = useParams();
  const [beat, setBeat] = useState(null);

  useEffect(() => {
    const fetchBeat = async () => {
      const docRef = doc(db, 'beats', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBeat({ id: docSnap.id, ...docSnap.data() });
      }
    };

    fetchBeat();
  }, [id]);

  const isDiscountValid =
    beat?.discount > 0 &&
    (!beat.discountEndDate || new Date() < new Date(beat.discountEndDate));

  const finalPrice = isDiscountValid
    ? Number(beat.price) * (1 - beat.discount / 100)
    : Number(beat.price);

  const discountedBeat = {
    ...beat,
    price: finalPrice,
    discount: Number(beat.discount),
  };

  const [quantity, setQuantity] = useState(
    beat?.id && cartItems[beat.id]?.quantity ? cartItems[beat.id].quantity : 0
  );

  useEffect(() => {
    if (beat && user) {
      updateQuantity(beat.id, discountedBeat, quantity);
    }
  }, [beat, quantity, user]);

  const handleQuantityChange = (action) => {
    if (!user) {
      navigate('/login'); // redirect to sign-in if not logged in
      return;
    }
    setQuantity(prev => action === 'add' ? prev + 1 : Math.max(prev - 1, 0));
  };

  if (!beat) return <p style={{ color: '#fff' }}>Beat not found.</p>;

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      padding: '2rem',
      maxWidth: 1000,
      margin: '0 auto',
      backgroundColor: '#121418',
      color: '#f1f1f1',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <FaBars size={24} style={{ cursor: 'pointer', color: '#ffffffcc' }} onClick={() => navigate(-1)} />
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          letterSpacing: '-0.5px'
        }}>🎵 RabsStore</h1>
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => navigate('/Cart')}
        >
          <FaShoppingCart size={24} style={{ color: '#ffffffcc' }} />
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

      {/* YouTube Preview */}
      {beat.youtubeUrl && (
        <div style={{ width: '100%', maxWidth: 600, marginTop: '1.5rem' }}>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(beat.youtubeUrl).search).get("v")}`}
            title="YouTube preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 10 }}
          ></iframe>
        </div>
      )}

      {/* Beat Details */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#1d1f27',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
        padding: '2rem'
      }}>
        <img
          src={beat.image}
          alt={beat.title}
          style={{
            width: '100%',
            maxWidth: 600,
            height: 300,
            objectFit: 'cover',
            borderRadius: 10,
            marginBottom: '1.5rem'
          }}
        />
        <h3 style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>{beat.title}</h3>
        <p style={{ fontSize: '1rem', color: '#bbb' }}>{beat.genre}</p>
        {typeof beat.licensesAvailable === 'number' && (
          <p style={{ fontSize: '1rem', color: beat.licensesAvailable > 0 ? '#4caf50' : '#f87171' }}>
            {beat.licensesAvailable > 0
              ? `${beat.licensesAvailable} license(s) available`
              : '❌ No licenses left'}
          </p>
        )}

        {/* Discount / Price Display */}
        <div style={{ marginTop: '0.5rem' }}>
          {isDiscountValid ? (
            <>
              <p style={{ fontSize: '1.2rem', color: '#888', textDecoration: 'line-through' }}>
                ₵{Number(beat.price).toFixed(2)}
              </p>
              <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#4caf50' }}>
                ₵{finalPrice} ({beat.discount}% OFF)
              </p>
            </>
          ) : (
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              ₵{finalPrice}
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <button
            onClick={() => handleQuantityChange('remove')}
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              background: '#2c2e3a',
              border: 'none',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            <FaMinus />
          </button>
          <span style={{ fontSize: '1.3rem' }}>{quantity}</span>
          <button
            onClick={() => handleQuantityChange('add')}
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              background: '#2c2e3a',
              border: 'none',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            <FaPlus />
          </button>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#3f404d',
              color: '#fff',
              border: 'none',
              padding: '0.8rem 1.6rem',
              borderRadius: 10,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeatDetails;
