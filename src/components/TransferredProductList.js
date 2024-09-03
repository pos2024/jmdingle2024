import React, { useState, useEffect } from 'react';
import db from '../firebase';
import { getDocs, collection } from 'firebase/firestore';

const TransferredProductList = () => {
  const [transferredProducts, setTransferredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransferredProducts = async () => {
      try {
        const transferredProductsRef = collection(db, 'TransferredProducts');
        const transferredProductsSnapshot = await getDocs(transferredProductsRef);
        const transferredProductsData = transferredProductsSnapshot.docs.map(doc => ({
          id: doc.id,
          products: doc.data()
        }));
        setTransferredProducts(transferredProductsData);
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
      <h1 className="text-2xl font-bold mb-4">Transferred Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transferredProducts.map(doc => (
          <div key={doc.id} className="bg-white rounded-lg shadow-md p-4">
            {Object.values(doc.products).map((product, index) => (
              <div key={index}>
                <p className="text-lg font-semibold mb-2">Product ID: {product?.productId}</p>
                <p className="text-sm">Name: {product?.productName}</p>
                <p className="text-sm">Quantity: {product?.quantity}</p>
                <p className="text-sm">Transfer Date: {product?.transferDate}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransferredProductList;
