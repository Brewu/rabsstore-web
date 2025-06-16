import { PaystackButton } from 'react-paystack';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const publicKey = 'your_paystack_public_key';
  const email = 'user@example.com';

  const onSuccess = () => {
    // Save order to DB
    clearCart();
    alert('Payment successful! Download links will be sent.');
  };

  return (
    <PaystackButton
      email={email}
      amount={total * 100}
      publicKey={publicKey}
      text="Pay Now"
      onSuccess={onSuccess}
      onClose={() => alert('Payment cancelled')}
    />
  );
};
