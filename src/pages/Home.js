// Parent Component (e.g., Home.js)
import React, { useState } from 'react';
import Cart from '../components/Cart';
import NoBarcodeItems from '../components/NoBarcodeItems';
import NoBarcodeDrinks from '../components/NoBarcodeDrinks';
import background from '../assets/back2.png'

const Home = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [toggle, setToggle] =useState('0');
  const firstBackground = {
    minHeight: "100vh", 
    backgroundImage: `url(${background})`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat", 
  };

  const CigaretteHandler=()=>{
    setToggle(1);
  }
  const DrinksHandler=()=>{
    setToggle(2);
  }
  const CandiesHandler=()=>{
    setToggle(3);
  }

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
    <div className='flex'  style={firstBackground}>

     
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
    

      <div className=' w-3/5'>
      <ul className='flex space-x-2 mb-2 mt-3 p-1'>
        <li className='text-md font-semibold' onClick={CigaretteHandler}> <span className={toggle === 1 ? `text-[#623288] text-lg font-bold ` : `text-gray-400`}>Cigarette</span></li>
        <li className='text-md  font-semibold' onClick={DrinksHandler}><span  className={toggle === 2 ? `text-[#623288] text-lg  font-bold` : `text-gray-400`}>Drinks</span></li>
     </ul>
       
      {toggle === 1 ?  <NoBarcodeItems addToCart={addToCart} />  : toggle === 2 ?    <NoBarcodeDrinks addToCart={addToCart}/>  : null }
     
      </div>

    </div>
  );
};

export default Home;
