import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // Make sure the path is correct
import {FaShoppingCart } from 'react-icons/fa';

const BeatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beat, setBeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart,cartItems } = useCart();
const isInCart = beat ? !!cartItems[beat.id] : false;

  useEffect(() => {
    const fetchBeat = async () => {
      try {
        const docRef = doc(db, 'beats', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBeat({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such beat!');
        }
      } catch (error) {
        console.error('Error fetching beat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeat();
  }, [id]);

  if (loading) return <p style={{ color: '#fff', padding: '2rem' }}>Loading...</p>;
  if (!beat) return <p style={{ color: '#fff', padding: '2rem' }}>Beat not found.</p>;

  const isDiscountValid =
    beat.discount > 0 &&
    (!beat.discountEndDate || new Date() < new Date(beat.discountEndDate));

  const finalPrice = isDiscountValid
    ? beat.price * (1 - beat.discount / 100)
    : beat.price;

  const handleAddToCart = () => {
    addToCart({
      id: beat.id,
      title: beat.title,
      price: finalPrice,
      image: beat.image,
      audio: beat.audio,
    });
    alert('Beat added to cart!');
  };

  return (
    <div style={{ backgroundColor: '#121418', minHeight: '100vh', padding: '2rem', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            color: '#fff',
            marginBottom: '1rem',
            border: 'none',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <FaArrowLeft /> Back
        </button>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{beat.title}</h1>
        <p style={{ color: '#bbb', marginBottom: '1rem' }}>{beat.genre}</p>

        <img
          src={beat.image}
          alt={beat.title}
          style={{
            width: '100%',
            borderRadius: 10,
            pointerEvents: 'none',
            userSelect: 'none',
            marginBottom: '1rem',
            height: 250,
            objectFit: 'cover'
          }}
        />

        <audio controls src={beat.audio} style={{ width: '100%' }} />

        <div style={{ marginTop: '1rem' }}>
          {isDiscountValid ? (
            <>
              <p style={{ textDecoration: 'line-through', color: '#999' }}>
                ₵{beat.price.toFixed(2)}
              </p>
              <p style={{ fontSize: '1.5rem', color: '#4caf50' }}>
                ₵{finalPrice.toFixed(2)} ({beat.discount}% OFF)
              </p>
            </>
          ) : (
            <p style={{ fontSize: '1.5rem' }}>₵{finalPrice.toFixed(2)}</p>
          )}
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
          {beat.licensesAvailable > 0
            ? `${beat.licensesAvailable} license(s) available`
            : '❌ No licenses left'}
        </p>

        <button
          onClick={!isInCart ? handleAddToCart : null}
          disabled={isInCart}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            background: isInCart ? '#888' : '#4caf50',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: 8,
            border: 'none',
            fontWeight: 600,
            cursor: isInCart ? 'not-allowed' : 'pointer'
          }}
        >
          <FaShoppingCart />
          {isInCart ? 'Added to Cart' : 'Add to Cart'}
        </button>

<button
  onClick={() => navigate('/cart')}
  style={{
    background: '#4caf50',
    color: '#fff',
    padding: '0.6rem 1rem',
    borderRadius: 8,
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginLeft: 'auto' // push to right if wrapped with flex
  }}
>
  <FaShoppingCart /> Go to Cart
</button>

      </div>
    </div>
  );
};

export default BeatDetails;
