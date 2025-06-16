import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { FaShoppingCart, FaBars, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const BeatDetails = () => {
  const { id } = useParams(); // <-- get beat ID from URL
  const [beat, setBeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cartItems, updateQuantity, totalItems } = useCart();
  const auth = getAuth();
  const user = auth.currentUser;

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchBeat = async () => {
      try {
        const docRef = doc(db, 'beats', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const beatData = docSnap.data();
          const isDiscountValid =
            beatData.discount > 0 &&
            (!beatData.discountEndDate || new Date() < new Date(beatData.discountEndDate));

          const finalPrice = isDiscountValid
            ? Number(beatData.price) * (1 - beatData.discount / 100)
            : Number(beatData.price);

          const fullBeat = {
            id,
            ...beatData,
            price: finalPrice,
            discount: beatData.discount,
          };

          setBeat(fullBeat);
          setQuantity(cartItems[id]?.quantity || 0);
        } else {
          console.log('No such beat!');
        }
      } catch (error) {
        console.error('Error fetching beat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeat();
  }, [id, cartItems]);

  useEffect(() => {
    if (beat && user) {
      updateQuantity(beat.id, beat, quantity);
    }
  }, [quantity, beat, user]);

  const handleQuantityChange = (action) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setQuantity(prev => action === 'add' ? prev + 1 : Math.max(prev - 1, 0));
  };

  if (loading) return <p style={{ color: '#fff' }}>Loading...</p>;
  if (!beat) return <p style={{ color: '#fff' }}>Beat not found.</p>;

  return (
    <div style={{ backgroundColor: '#121418', minHeight: '100vh', padding: '2rem', color: '#fff' }}>
      {/* Same JSX from your existing BeatDetails goes here */}
      {/* The only change is: beat comes from Firebase using the ID */}
    </div>
  );
};

export default BeatDetails;
