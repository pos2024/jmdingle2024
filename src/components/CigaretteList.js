import React, { useState, useEffect } from 'react';
import Table from './Table';  // Assuming you saved the table component in a file named `Table.js`
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; // Firebase imports

const CigaretteList = () => {
  const [products, setProducts] = useState([]);
  
  // Define columns for the table
  const columns = [
    { Header: 'Category Child ID', accessor: 'categoryChildID' },
    { Header: 'Name', accessor: 'name' },
    { 
      Header: 'Packs', 
      accessor: 'packs',
      Cell: ({ row }) => {
        const packs = Math.floor(row.original.quantity / 20);  // Integer part of the division
        const remainder = row.original.quantity % 20;          // Remainder
        return `${packs} (${remainder})`;                      // Display as "packs (remainder)"
      }
    },
    { Header: 'Other Price', accessor: 'otherPrice' },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Selling Price', accessor: 'sellingPrice' },
    { Header: 'Wholesale Price', accessor: 'wholesalePrice' },
   
    { 
      Header: 'Total Wholesale Price', 
      accessor: 'totalWholesalePrice', 
      Cell: ({ row }) => (row.original.wholesalePrice * row.original.quantity).toFixed(2)
    },
    { 
      Header: 'Total Other Price', 
      accessor: 'totalOtherPrice', 
      Cell: ({ row }) => (row.original.otherPrice * row.original.quantity).toFixed(2)
    },
    { 
      Header: 'Profit', 
      accessor: 'profit', 
      Cell: ({ row }) => {
        const totalWholesalePrice = row.original.wholesalePrice * row.original.quantity;
        const totalOtherPrice = row.original.otherPrice * row.original.quantity;
        return (totalOtherPrice - totalWholesalePrice).toFixed(2);
      }
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore
        const productsRef = collection(db, 'products');
        
        // Query products where categoryID is "Cigarette"
        const q = query(productsRef, where('categoryID', '==', 'Cigarette'));
        const querySnapshot = await getDocs(q);
        
        // Map products and calculate Packs, Total Prices, and Profit
        const productsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            packs: `${Math.floor(data.quantity / 20)} (${data.quantity % 20})`,  // Packs with remainder
            totalWholesalePrice: data.wholesalePrice * data.quantity,
            totalOtherPrice: data.otherPrice * data.quantity,
            profit: (data.otherPrice * data.quantity) - (data.wholesalePrice * data.quantity)
          };
        });

        setProducts(productsData); // Set the products to state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container bg-gray-300 mx-auto p-4 mt-24">
      <h2 className="text-xl font-bold mb-4">Cigarette Products</h2>
      <Table columns={columns} data={products} />  {/* Pass columns and products data to Table */}
    </div>
  );
};

export default CigaretteList;
