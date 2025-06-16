import React from 'react';
import { useCart } from '../context/CartContext';
import { FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PayButton from '../PayButton';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // make sure this is correct






const CartScreen = () => {
  const { cartItems, updateQuantity } = useCart();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [hasOutOfStock, setHasOutOfStock] = useState(false);
  useEffect(() => {
    const checkLicenses = async () => {
      for (const item of Object.values(cartItems)) {
        const beatId = item.beat?.id;
        if (!beatId) continue;

        try {
          const beatDoc = await getDoc(doc(db, 'beats', beatId));
          if (beatDoc.exists()) {
            const beatData = beatDoc.data();
            if ((beatData.licensesAvailable ?? 0) <= 0) {
              setHasOutOfStock(true);
              return;
            }
          }
        } catch (err) {
          console.error('Error checking license count:', err);
        }
      }
      setHasOutOfStock(false); // No out-of-stock beats
    };

    checkLicenses();
  }, [cartItems]);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent UI flash while redirecting

  // Calculate total discounted price
  const totalPrice = Object.values(cartItems).reduce((sum, item) => {
    if (!item || !item.beat) return sum;

    const beat = item.beat;
    const quantity = item.quantity;

    const basePrice = Number(beat.price);
    const discountPercent = Number(beat.discount);
    const discountEndDate = beat.discountEndDate
      ? new Date(beat.discountEndDate.seconds * 1000)
      : null;

    const isDiscounted =
      !isNaN(discountPercent) &&
      discountPercent > 0 &&
      (!discountEndDate || new Date() < discountEndDate);

    const priceToUse = isDiscounted
      ? basePrice * (1 - discountPercent / 100)
      : basePrice;

    return sum + quantity * priceToUse;
  }, 0);


  console.table(Object.values(cartItems).map(item => ({
    title: item.beat.title,
    discount: item.beat.discount,
    discountEndDate: item.beat.discountEndDate,
    price: item.beat.price,
    quantity: item.quantity
  })));

  ;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <FaArrowLeft style={{ cursor: 'pointer' }} size={20} onClick={() => navigate(-1)} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Your Cart</h2>
        <div></div>
      </div>

      {/* Cart Items */}
      {Object.values(cartItems).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Your cart is empty.</p>
      ) : (
        Object.values(cartItems).map((item, index) => {
          if (!item || !item.beat) return null;
          const { beat, quantity } = item;

          // Check for discount
          const originalPrice = Number(beat.price);
          const discountPercent = Number(beat.discount);
          const discountEndDate = beat.discountEndDate
            ? new Date(beat.discountEndDate.seconds * 1000)
            : null;

          const isDiscounted =
            !isNaN(discountPercent) &&
            discountPercent > 0 &&
            (!discountEndDate || new Date() < discountEndDate);

          const discountedPrice = isDiscounted
            ? originalPrice * (1 - discountPercent / 100)
            : originalPrice;


          return (
            <div key={beat.id || index} style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              background: '#1e1e1e',
              padding: '1rem',
              borderRadius: 12,
              marginBottom: '1rem'
            }}>
              <img src={beat.image} alt={beat.title} style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 10
              }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{beat.title}</h4>
                <p style={{ margin: '0.2rem 0', color: '#bbb' }}>{beat.genre}</p>
                {isDiscounted ? (
                  <div>
                    <p style={{ color: '#aaa', textDecoration: 'line-through', margin: 0 }}>
                      ₵{originalPrice.toFixed(2)}
                    </p>
                    <p style={{ fontWeight: 'bold', color: '#4caf50', margin: 0 }}>
                      ₵{discountedPrice.toFixed(2)} ({beat.discount}% OFF)
                    </p>
                  </div>
                ) : (
                  <p style={{ fontWeight: 'bold', color: '#fff' }}>₵{originalPrice.toFixed(2)}</p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateQuantity(beat.id, beat, quantity - 1)} style={btnStyle}><FaMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => updateQuantity(beat.id, beat, quantity + 1)} style={btnStyle}><FaPlus /></button>
              </div>
            </div>
          );
        })
      )}

      {/* Total + Checkout */}
      {Object.values(cartItems).length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3
            style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#76ff03',
              background: 'linear-gradient(to right, #00c853, #b2ff59)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
            }}
          >
            Total: ₵{totalPrice.toFixed(2)}
          </h3>
          <PayButton
            cartItems={Object.values(cartItems)}
            totalAmount={totalPrice}
            navigation={navigate}
            style={proceedBtnStyle}
            disabled={hasOutOfStock}
            text={hasOutOfStock ? 'Some beats are sold out' : 'Proceed to Checkout'}
          />

        </div>
      )}
    </div>
  );
};

const btnStyle = {
  background: '#333',
  border: 'none',
  borderRadius: '50%',
  padding: '0.4rem',
  color: '#fff',
  cursor: 'pointer'
};
const proceedBtnStyle = {
  marginTop: '1rem',
  background: 'linear-gradient(90deg, #00c853, #64dd17)',
  border: 'none',
  padding: '0.8rem 2rem',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#fff',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  transition: 'background 0.3s ease, transform 0.2s ease',
};



export default CartScreen;
