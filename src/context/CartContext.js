// src/contexts/CartContext.js
import React, { createContext, useContext, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  // ✅ Add to cart logic
  const addToCart = (beat) => {
    if (!beat || !beat.id || beat.price == null) {
      console.warn('Invalid beat passed to addToCart:', beat);
      return;
    }

    setCartItems(prevItems => {
      const existing = prevItems[beat.id];
      return {
        ...prevItems,
        [beat.id]: {
          beat,
          quantity: existing ? existing.quantity + 1 : 1,
        }
      };
    });
  };

  // ✅ Quantity updater
  const updateQuantity = (id, beat, quantity) => {
    if (!beat || !beat.id || beat.price == null) {
      console.warn('Invalid beat passed to updateQuantity:', beat);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = { ...prevItems };
      if (quantity <= 0) {
        delete updatedItems[id];
      } else {
        updatedItems[id] = { beat, quantity };
      }
      return updatedItems;
    });
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCartItems({});
  };

  // ✅ Checkout and save to Firestore
  const checkout = async (paymentRef = '') => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No authenticated user');
    }

    const items = Object.values(cartItems).map(({ beat, quantity }) => ({
      beatId: beat.id,
      title: beat.title,
      price: beat.price,
      quantity,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      await addDoc(collection(db, 'purchases'), {
        userId: user.uid,
        items,
        totalAmount,
        paidAt: Timestamp.now(),
        paymentRef,
      });
      clearCart(); // empty cart after purchase
      return true;
    } catch (err) {
      console.error('Failed to record purchase:', err);
      return false;
    }
  };

  const totalItems = Object.values(cartItems).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      clearCart,
      checkout,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
