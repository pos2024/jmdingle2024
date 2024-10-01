import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '../firebase';
import background from '../assets/back2.png'

const NoBarcodeItems = ({ addToCart }) => {
  const [items, setItems] = useState([]);


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
    <div className=' h-auto w-full sm:h-auto p-4'>
     <div>
     <h2 className='text-xl text-[#623288] font-bold mb-4'> 1 stick Cigarette</h2>
      <div className='grid grid-cols-4 gap-2'>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item.name, item.otherQuantity, item.sellingPrice)} // Use item.quantitiesButton for the quantity
              className='bg-[#623288] text-sm text-white font-bold p-1 rounded'
            >
              {item.name}
            </button>
          ))
        )}
      </div>

      <div>
      <h2 className='text-xl text-[#623288] font-bold mt-4 mb-4'>1 Pack Cigarette</h2>
      <div className='grid grid-cols-4 gap-2'>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item.name, item.quantitiesButton, item.otherPrice)} // Use item.quantitiesButton for the quantity
             className='bg-[#623288] text-sm text-white font-bold p-1 rounded'
            >
              {item.name}
            </button>
          ))
        )}
      </div>
      </div>
     </div>
    </div>
  );
};

export default NoBarcodeItems;
