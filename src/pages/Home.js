// Parent Component (e.g., Home.js)
import React from 'react';
import Cart from '../components/Cart';
import NoBarcodeItems from '../components/NoBarcodeItems';

const Home = () => {
  const [cartItems, setCartItems] = React.useState([]);

  const addToCart = (name, quantity, price) => {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.name === name
          ? { ...item, quantity: item.quantity + quantity, price: item.price + (quantity * price) }
          : item
      ));
    } else {
      setCartItems([...cartItems, { name, quantity, price: price * quantity }]);
    }
  };

  return (
    <div className='flex'>
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
      <NoBarcodeItems addToCart={addToCart} />
    </div>
  );
};

export default Home;
