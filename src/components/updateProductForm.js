import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import db from "../firebase";

const UpdateProductForm = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryID: '',
    categoryChildID: '',
    quantity: '',
    sellingPrice: '',
    wholesalePrice: '',
    otherPrice: '', 
    otherQuantity: '', 
    quantitiesButton: 0, 
    fliptopQuantity:'',
    NoBarcodeItems: false, 
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        categoryID: product.categoryID,
        categoryChildID: product.categoryChildID,
        quantity: product.quantity,
        sellingPrice: product.sellingPrice,
        wholesalePrice: product.wholesalePrice,
        otherPrice: product.otherPrice || '', 
        otherQuantity: product.otherQuantity || '',
        quantitiesButton: product.quantitiesButton || 0, 
        NoBarcodeItems: product.NoBarcodeItems || false, 
        fliptopQuantity: product.fliptopQuantity
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'quantitiesButton' ? Number(value) : value, // Handle checkbox and number fields
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    const productRef = doc(db, "products", product.id);

    try {
      await updateDoc(productRef, formData);
      onSave(); // Close the modal and refresh the list
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  if (!product) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input 
          type="text" 
          name="categoryID" 
          value={formData.categoryID} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Subcategory</label>
        <input 
          type="text" 
          name="categoryChildID" 
          value={formData.categoryChildID} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input 
          type="number" 
          name="quantity" 
          value={formData.quantity} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Selling Price</label>
        <input 
          type="number" 
          name="sellingPrice" 
          value={formData.sellingPrice} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Wholesale Price</label>
        <input 
          type="number" 
          name="wholesalePrice" 
          value={formData.wholesalePrice} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Other Price</label>
        <input 
          type="number" 
          name="otherPrice" 
          value={formData.otherPrice} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Other Quantity</label>
        <input 
          type="number" 
          name="otherQuantity" 
          value={formData.otherQuantity} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantities Button</label>
        <input 
          type="number" 
          name="quantitiesButton" 
          value={formData.quantitiesButton} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">No Barcode Item</label>
        <input 
          type="checkbox" 
          name="NoBarcodeItems" 
          checked={formData.NoBarcodeItems} 
          onChange={handleChange} 
          className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fliptop</label>
        <input 
          type="number" 
          name="fliptopQuantity" 
          value={formData.fliptopQuantity} 
          onChange={handleChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <button 
          type="button" 
          onClick={() => onSave()} 
          className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
      
          Cancel
        </button>
        <button 
          type="submit" 
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UpdateProductForm;
