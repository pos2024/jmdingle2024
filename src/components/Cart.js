import React, { useState, useRef } from 'react';
import { getDocs, query, where, collection, addDoc, doc, runTransaction } from "firebase/firestore";
import db from '../firebase'; // Adjust import path to your Firebase configuration
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import useFocus from './useFocus'; // Adjust import path to your useFocus hook

const Cart = ({ cartItems, setCartItems }) => {
  const [itemCode, setItemCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cash, setCash] = useState(0);
  const itemCodeRef = useRef(null); // Reference to the item code input field

  // Use custom hook to focus on item code input field
  useFocus(itemCodeRef, [cartItems, itemCode, quantity, cash]);

  // Function to add items to the cart
  const addToCart = async (code, qty) => {
    const itemDetails = await getItemDetailsByCode(code);
    const existingItem = cartItems.find(item => item.code === code && item.name === itemDetails.name);
  
    const newItem = {
      id: Date.now(), // Use timestamp or UUID for a unique ID
      code,
      name: itemDetails.name,
      quantity: qty,
      price: itemDetails.price * qty
    };
  
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.code === code && item.name === itemDetails.name
          ? {
              ...item,
              quantity: item.quantity + Number(qty), // Ensure qty is treated as a number
              price: (item.quantity + Number(qty)) * itemDetails.price // Update price accordingly
            }
          : item
      ));
    } else {
      setCartItems([...cartItems, newItem]);
    }
  
    setItemCode('');
    setQuantity(1);
  };

  // Fetch item details based on barcode
  const getItemDetailsByCode = async (code) => {
    try {
      const itemsRef = collection(db, "products");
      const q = query(itemsRef, where("barcode", "==", code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const itemData = querySnapshot.docs[0].data();
        return {
          name: itemData.name,
          price: itemData.sellingPrice
        };
      } else {
        return { name: 'Unknown Item', price: 0 };
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      return { name: 'Error', price: 0 };
    }
  };

  // Handle scan event
  const handleScan = (e) => {
    if (e.key === 'Enter') {
      addToCart(itemCode, quantity);
    }
  };

  // Handle click on "Add to Cart" button
  const handleAddToCartClick = () => {
    addToCart(itemCode, quantity);
  };

  // Increase item quantity
  const increaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              price: (item.price / item.quantity) * (item.quantity + 1) // Calculate new price
            }
          : item
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1, // Prevent quantity from going below 1
              price: (item.price / item.quantity) * (item.quantity - 1) // Calculate new price
            }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItemFromCart = (id, name) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.name === name)));
  };

  // Handle denomination button click
  const handleDenominationClick = (value) => {
    setCash(prevCash => prevCash + value);
  };

  // Handle cash input change
  const handleCashChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setCash(value);
    }
  };

  // Calculate total and change
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const change = cash - total;

  // Submit
  const handleSubmit = async () => {
    try {
      // Record the sale
      const saleRef = collection(db, "sales");
      const saleData = {
        items: cartItems,
        totalAmount: total,
        cashReceived: cash,
        change: change,
        timestamp: new Date(),
      };
      await addDoc(saleRef, saleData);
  
      // Prepare data for transaction
      const productUpdates = {};
      const itemsRef = collection(db, "products");
  
      // Fetch all necessary data before starting the transaction
      for (const item of cartItems) {
        let productQuery;
        if (item.code) {
          // Handle barcode items
          productQuery = query(itemsRef, where("barcode", "==", item.code));
        } else {
          // Handle no-barcode items
          productQuery = query(itemsRef, where("name", "==", item.name));
        }
  
        const querySnapshot = await getDocs(productQuery);
  
        if (querySnapshot.empty) {
          console.error(`Item not found: ${item.code || item.name}`);
          continue;
        }
  
        const productDoc = querySnapshot.docs[0];
        const productRef = productDoc.ref;
        const productData = productDoc.data();
        const newQuantity = productData.quantity - item.quantity;
  
        if (newQuantity < 0) {
          console.error(`Not enough stock for item. Current stock: ${productData.quantity}, Requested: ${item.quantity}`);
          continue;
        }
  
        productUpdates[productRef.id] = newQuantity;
      }
  
      // Perform the transaction to update inventory
      await runTransaction(db, async (transaction) => {
        for (const [productId, newQuantity] of Object.entries(productUpdates)) {
          const productRef = doc(db, "products", productId);
          transaction.update(productRef, { quantity: newQuantity });
        }
      });
  
      console.log("Sale recorded and inventory updated successfully");
  
      // Clear cart and reset cash
      setCartItems([]);
      setCash(0);
    } catch (error) {
      console.error("Error recording sale and updating inventory:", error);
    }
  };

  return (
    <div className='bg-gradient-to-r from-[#623288] to-[#4B0082] flex flex-col justify-between h-screen w-full sm:w-2/5 p-4'>
      <div>
        <div className="mb-2">
          <label className="block text-white mb-2">Item Code:</label>
          <input
            type="text"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            onKeyDown={handleScan}
            className="border border-gray-400 rounded-md p-1 w-full"
            ref={itemCodeRef} // Attach ref here
          />
        </div>
        <div className="mb-2">
          <label className="block text-white mb-1">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border border-gray-400 rounded-md px-4 py-2 w-full"
            min="1"
          />
        </div>
        <button
          onClick={handleAddToCartClick}
          className="bg-white text-[#623288] font-bold py-2 px-4 rounded w-full"
        >
          Add to Cart
        </button>

        <div className="mt-8 text-white bg-[#1d1d1d] p-2 rounded h-auto">
          <h2 className="text-xl font-bold">Cart Items</h2>
          <ul className="mt-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row justify-between items-center mb-2">
                <div className="flex items-center">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className={`bg-[#623288] font-bold text-gray-200 px-1 rounded-l ${item.noBarcode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={item.noBarcode}
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className={`bg-[#623288] font-bold text-gray-200 px-1 rounded-r ${item.noBarcode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={item.noBarcode}
                  >
                    +
                  </button>
                </div>
                <span className="flex-grow px-2 text-center sm:text-left">{item.name}</span>
                <span className="px-2">₱{item.price.toFixed(2)}</span>
                <button
                  onClick={() => removeItemFromCart(item.id, item.name)}
                  className="text-red-500"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='bg-[#1d1d1d] p-2 rounded-md mt-4'>
        <div className="text-white">
          <h2 className="text-xl font-bold">Total: ₱{total.toFixed(2)}</h2>
          <div className='flex flex-col sm:flex-row items-center justify-between mt-2'>
            <h2 className="text-xl font-bold">Cash Given: ₱{cash}</h2>
            <button
              onClick={() => setCash(0)}
              className="bg-[#623288] text-white text-sm font-bold py-1 px-2 rounded mt-2 sm:mt-0"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap mt-2 gap-2">
            {[1000, 500, 200, 100, 50, 20].map(value => (
              <button
                key={value}
                onClick={() => handleDenominationClick(value)}
                className="bg-[#623288] text-gray-200 font-bold py-1 px-2 rounded"
              >
                ₱{value}
              </button>
            ))}
          </div>
          <h2 className="text-xl font-bold mt-2">Change: ₱{change.toFixed(2)}</h2>
          <button
            onClick={handleSubmit}
            className={`bg-[#623288] text-white font-bold py-2 px-4 rounded w-full mt-4 ${cartItems.length === 0 ? ' cursor-not-allowed bg-gray-500' : ''}`}
            disabled={cartItems.length === 0}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
