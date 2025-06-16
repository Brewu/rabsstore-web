import React, { useEffect, useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../src/firebase'; // adjust if needed
import { doc, getDoc, setDoc, collection, addDoc, runTransaction } from 'firebase/firestore';
import './App.css'
const PayButton = ({ cartItems, totalAmount, navigation, disabled, text = 'Proceed to Checkout' }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // fallback if `navigation` not passed
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
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email || '',
    amount: Math.floor(totalAmount * 100),
    currency: 'GHS',
  publicKey: 'pk_live_8d4c28909955abffbbe71e4f11dbeb362c13149e',
  
  };

  const onSuccess = async (reference) => {
    alert('✅ Payment Success');
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const purchasedBeats = [];

    if (!currentUser) return alert('User not logged in');

    for (const item of cartItems) {
      const beatId = item.beat?.id || item.beatId;
      if (!beatId) continue;

      try {
        const beatRef = doc(db, 'beats', beatId);
        await runTransaction(db, async (transaction) => {
          const beatDoc = await transaction.get(beatRef);
          if (!beatDoc.exists()) throw new Error('Beat not found');

          const beat = beatDoc.data();
          const currentLicenses = beat.licensesAvailable ?? 0;
          if (currentLicenses <= 0) throw new Error('No licenses available');

          transaction.update(beatRef, {
            licensesAvailable: currentLicenses - 1,
          });

          const purchaseData = {
            title: beat.title,
            telegramlink: beat.downloadlink,
            zipPassword: beat.zipPassword || '',
            price: beat.price || 0,
            currency: 'GHS',
            purchasedAt: new Date().toISOString(),
          };

          await addDoc(collection(db, `users/${currentUser.uid}/purchases`), purchaseData);
          purchasedBeats.push(purchaseData);
        });

      } catch (err) {
        console.error('Error processing beat:', err);
        alert(`❌ Error processing beat: ${err.message}`);
      }
    }

    // Go to success page
    navigate('/Success', {
      state: {
        reference: reference?.reference || reference,
        purchasedBeats,
      },
    });
  };

  return (
    <PaystackButton
      {...config}
      onSuccess={onSuccess}
      onClose={() => alert('❌ Payment Closed')}
      text={text}
      className="paystack-button"
      disabled={disabled}
    />
  );
};

export default PayButton;
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