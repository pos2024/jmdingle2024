import React, { useState, useEffect } from 'react';
import db from "../firebase";
import { addDoc, getDocs, collection } from "firebase/firestore";

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [quantity, setQuantity] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [NoBarcodeItems, setNoBarcodeItems] = useState(false); // New state for NoBarcodeItems
  const [categories, setCategories] = useState([]);
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [categoryChildID, setCategoryChildID] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedCategoryID = e.target.value;
    setCategoryID(selectedCategoryID);

    try {
      const childrenRef = collection(db, "categories", selectedCategoryID, "children");
      const childrenSnapshot = await getDocs(childrenRef);
      const childrenData = childrenSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategoryChildren(childrenData);
    } catch (error) {
      console.error("Error fetching category children: ", error);
    }
  };

  const handleCategoryChildChange = (e) => {
    const selectedCategoryChildID = e.target.value;
    setCategoryChildID(selectedCategoryChildID);
  };

  const handleNoBarcodeItemsChange = (e) => {
    setNoBarcodeItems(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add product to Firestore
      const docRef = await addDoc(collection(db, 'products'), {
        name: productName,
        categoryID: categoryID,
        categoryChildID: categoryChildID,
        sellingPrice: parseFloat(sellingPrice),
        quantity: parseInt(quantity),
        wholesalePrice: parseFloat(wholesalePrice),
        barcode: barcode,
        NoBarcodeItems: NoBarcodeItems // Include NoBarcodeItems in the product data
      });

      console.log('Product added with ID: ', docRef.id);

      // Reset form fields
      setProductName('');
      setCategoryID('');
      setCategoryChildID('');
      setSellingPrice('');
      setQuantity('');
      setWholesalePrice('');
      setBarcode('');
      setNoBarcodeItems(false); // Reset NoBarcodeItems field
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-white p-4">
        <div className="mb-4">
          <label htmlFor="productName" className="block text-gray-700 font-bold mb-2">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category:</label>
          <select id="category" value={categoryID} onChange={handleCategoryChange} className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500" required>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="categoryChild" className="block text-gray-700 font-bold mb-2">Sub Categories:</label>
          <select id="categoryChild" value={categoryChildID} onChange={handleCategoryChildChange} className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500" required>
            <option value="">Select SubCategories</option>
            {categoryChildren.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="sellingPrice" className="block text-gray-700 font-bold mb-2">Selling Price:</label>
          <input
            type="number"
            id="sellingPrice"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="wholesalePrice" className="block text-gray-700 font-bold mb-2">Wholesale Price:</label>
          <input
            type="number"
            id="wholesalePrice"
            value={wholesalePrice}
            onChange={(e) => setWholesalePrice(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="barcode" className="block text-gray-700 font-bold mb-2">Barcode:</label>
          <input
            type="text"
            id="barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="NoBarcodeItems"
            checked={NoBarcodeItems}
            onChange={handleNoBarcodeItemsChange}
            className="mr-2"
          />
          <label htmlFor="NoBarcodeItems" className="text-gray-700">No Barcode Items</label>
        </div>
        <button type="submit" className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
