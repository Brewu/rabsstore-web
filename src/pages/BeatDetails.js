import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaShoppingCart, FaBars, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getAuth } from 'firebase/auth';

const BeatDetails = () => {
  const { id } = useParams(); // Get beat ID from URL
  const navigate = useNavigate();
  const [beat, setBeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const { cartItems, updateQuantity, totalItems } = useCart();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBeat = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'beats', id));
        if (docSnap.exists()) {
          const beatData = { id: docSnap.id, ...docSnap.data() };
          setBeat(beatData);
          setQuantity(cartItems[beatData.id]?.quantity || 0);
        } else {
          console.error('Beat not found');
        }
      } catch (err) {
        console.error(err);
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

  if (loading) return <p>Loading...</p>;
  if (!beat) return <p>Beat not found.</p>;

  const isDiscountValid =
    beat.discount > 0 &&
    (!beat.discountEndDate || new Date() < new Date(beat.discountEndDate));

  const finalPrice = isDiscountValid
    ? Number(beat.price) * (1 - beat.discount / 100)
    : Number(beat.price);

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h2>{beat.title}</h2>
      <p>{beat.genre}</p>
      <p>Price: ₵{finalPrice}</p>

      {/* Add more UI like image, YouTube, and quantity controls */}
    </div>
  );
};

export default BeatDetails;
