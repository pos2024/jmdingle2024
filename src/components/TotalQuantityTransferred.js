import React, { useState, useEffect } from 'react';
import db from '../firebase';
import { getDocs, collection } from 'firebase/firestore';

const TotalQuantityTransferred = () => {
  const [productQuantities, setProductQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransferredProducts = async () => {
      try {
        const transferredProductsRef = collection(db, 'TransferredProducts');
        const transferredProductsSnapshot = await getDocs(transferredProductsRef);
        let productQuantitiesData = {};

        transferredProductsSnapshot.forEach(doc => {
          const products = doc.data();
          for (const productId in products) {
            if (productQuantitiesData[products[productId].productName]) {
              productQuantitiesData[products[productId].productName] += products[productId].quantity;
            } else {
              productQuantitiesData[products[productId].productName] = products[productId].quantity;
            }
          }
        });

        setProductQuantities(productQuantitiesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transferred products:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTransferredProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Total Quantity Transferred</h1>
      <ul>
        {Object.entries(productQuantities).map(([productName, quantity]) => (
          <li key={productName}>
            Product Name: {productName} <br />
            Total Quantity Transferred: {quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TotalQuantityTransferred;
