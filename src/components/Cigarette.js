import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import db from '../firebase'; // Adjust import path to your Firebase configuration

const Cigarette = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  // Fetch products with bundleId1 from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("bundleId", "==", "bundleId1"));
        const querySnapshot = await getDocs(q);

        const fetchedProducts = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Fetched product:', { id: doc.id, ...data }); // Log the product data
          fetchedProducts.push({ id: doc.id, ...data });
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle product click and call the updated addToCart logic
  const handleProductClick = async (product) => {
    console.log('Clicked product:', product); // Log clicked product

    try {
      // Assuming bundleId1 refers to bundle details in Firebase
      const bundleRef = collection(db, "bundle");
      const bundleQuery = query(bundleRef, where("bundleId", "==", "bundleId1"));
      const bundleSnapshot = await getDocs(bundleQuery);

      if (!bundleSnapshot.empty) {
        const bundleData = bundleSnapshot.docs[0].data();
        console.log('Bundle data:', bundleData); // Log bundle data

        const quantity = bundleData.quantity || 1; // Default to 1 if no quantity is specified
        const price = bundleData.price || product.sellingPrice; // Default to product price if no bundle price is set

        // Adding to cart with the updated structure
        addToCart(product.name, quantity, price); // Pass the product's name and price
      }
    } catch (error) {
      console.error("Error adding bundle to cart:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4">Cigarettes</h2>
      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            className="cursor-pointer border-b py-2 flex justify-between"
            onClick={() => handleProductClick(product)}
          >
            <span>{product.name}</span>
            <span>₱{product.sellingPrice}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cigarette;
