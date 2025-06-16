import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaShoppingCart, FaBars, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getAuth } from 'firebase/auth';

const BeatDetails = () => {
  const { id } = useParams(); // get beat ID from URL
  const [beat, setBeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, updateQuantity, totalItems } = useCart();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchBeat = async () => {
      try {
        const docRef = doc(db, 'beats', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const beatData = { id: docSnap.id, ...docSnap.data() };
          setBeat(beatData);
          setQuantity(cartItems[beatData.id]?.quantity || 0);
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
  }, [beat, quantity, user]);

  const handleQuantityChange = (action) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setQuantity((prev) => (action === 'add' ? prev + 1 : Math.max(prev - 1, 0)));
  };

  if (loading) return <p style={{ color: '#fff' }}>Loading...</p>;
  if (!beat) return <p style={{ color: '#fff' }}>Beat not found.</p>;

  const isDiscountValid =
    beat.discount > 0 &&
    (!beat.discountEndDate || new Date() < new Date(beat.discountEndDate));

  const finalPrice = isDiscountValid
    ? Number(beat.price) * (1 - beat.discount / 100)
    : Number(beat.price);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '2rem', maxWidth: 1000, margin: '0 auto', backgroundColor: '#121418', color: '#f1f1f1', minHeight: '100vh' }}>
      {/* ...same content as before with beat.youtubeUrl, beat.title, etc. */}
      {/* Just replace all state.beat with beat now */}
    </div>
  );
};

export default BeatDetails;
