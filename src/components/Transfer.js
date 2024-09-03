import React, { useState, useEffect } from 'react';
import db from '../firebase';
import { getDocs, collection, query, where, doc, updateDoc, addDoc, writeBatch } from 'firebase/firestore';

const Transfer = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [transferQuantities, setTransferQuantities] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
  }, []);

  const handleProductSelection = (productId) => {
    const index = selectedProducts.indexOf(productId);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, productId]);
      setTransferQuantities(prevState => ({
        ...prevState,
        [productId]: 1 // Default quantity to transfer is 1
      }));
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      setTransferQuantities(prevState => {
        const updatedQuantities = { ...prevState };
        delete updatedQuantities[productId];
        return updatedQuantities;
      });
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setTransferQuantities(prevState => ({
      ...prevState,
      [productId]: quantity
    }));
  };

  const handleTransfer = async () => {
    try {
      const batch = writeBatch(db);
    
      const transferredProducts = {}; // Object to store transferred products
  
      selectedProducts.forEach(productId => {
        const product = products.find(product => product.id === productId);
        const currentQuantity = product.quantity;
        const transferQuantity = transferQuantities[productId];
        const newQuantity = currentQuantity - transferQuantity;
  
        // Update the quantity in the products collection
        const productRef = doc(db, 'products', productId);
        batch.update(productRef, { quantity: newQuantity });
  
        // Add the transferred product to the object with the same TransferredId
        transferredProducts[productId] = {
          productId: productId,
          productName: product.name,
          quantity: transferQuantity,
          transferDate: new Date().toISOString(),
      
          // Add any other relevant fields here
        };
      });
  
      // Commit the batch update
      await batch.commit();
  
      // Add the object containing transferred products to the TransferredProducts collection
      const transferredProductsRef = collection(db, 'TransferredProducts');
      await addDoc(transferredProductsRef, transferredProducts);
  
      console.log('Products transferred successfully.');
    } catch (error) {
      console.error('Error transferring products: ', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='bg-white p-2 mt-10'>
        <h1 className="text-2xl font-bold mb-4">Transfer Products</h1>
        {/* Category filter dropdown */}
        <select value={selectedCategory} onChange={handleCategoryChange} className="border border-gray-400 rounded-md px-2  mb-4 focus:outline-none focus:border-blue-500">
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        {/* Product list */}
        <div className="flex flex-wrap">
          {filteredProducts.map(product => (
            <div key={product.id} className="m-2">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleProductSelection(product.id)}
              />
              <label className="ml-1">{product.name}</label>
              <input
                type="number"
                value={transferQuantities[product.id] || ''}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                disabled={!selectedProducts.includes(product.id)}
                className="border border-gray-400 rounded-md px-2  w-20 ml-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
        {/* Transfer button */}
        <button
          onClick={handleTransfer}
          disabled={selectedProducts.length === 0}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Transfer
        </button>
      </div>
    </div>
  );
};

export default Transfer;
