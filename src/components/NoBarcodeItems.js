import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '../firebase';
import background from '../assets/back2.png'

const NoBarcodeItems = ({ addToCart }) => {
  const [items, setItems] = useState([]);
  const firstBackground = {
    minHeight: "100vh", 
    backgroundImage: `url(${background})`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat", 
  };

  useEffect(() => {
    const fetchNoBarcodeItems = async () => {
      try {
        const q = query(collection(db, 'products'), where('NoBarcodeItems', '==', true));
        const querySnapshot = await getDocs(q);
        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        console.log('Fetched Items:', fetchedItems);
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching no barcode items:', error);
      }
    };

    fetchNoBarcodeItems();
  }, []);

  return (
    <div className='bg-gray-200 h-screen w-full p-4' style={firstBackground}>
      <h2 className='text-xl text-[#623288] font-bold mb-4'>No Barcode Items</h2>
      <div className='grid grid-cols-4 gap-2'>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item.name, item.quantitiesButton, item.sellingPrice)} // Use item.quantitiesButton for the quantity
              className='bg-[#623288] text-white font-bold py-2 px-2 rounded'
            >
              {item.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NoBarcodeItems;
