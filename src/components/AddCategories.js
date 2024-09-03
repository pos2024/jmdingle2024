import React, { useState } from 'react';
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import db from "../firebase";
import CategoriesAndSubCategoriesList from './CategoriesAndSubCategoriestList';
import AddSubCategories from './AddSubCategories';

const AddCategories = () => {
  const [categoryID, setCategoryID] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryID, setSubcategoryID] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add category to Firestore
      await setDoc(doc(db, 'categories', categoryID), {
        name: categoryName,
      });

      console.log('Category added successfully');

      // Add subcategory to Firestore under the newly created category
      await setDoc(doc(db, 'categories', categoryID, 'children', subcategoryID), {
        name: subcategoryName,
      });

      console.log('Subcategory added successfully');

      // Reset form fields
      setCategoryID('');
      setCategoryName('');
      setSubcategoryID('');
      setSubcategoryName('');
    } catch (error) {
      console.error('Error adding category and subcategory: ', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 w-full">
    
      <div className='flex justify-between space-x-5'>
      <form onSubmit={handleSubmit} className="bg-white shadow-md  w-1/4 rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4"> Categories and Subcategories</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryID">
            Category ID:
          </label>
          <input
            id="categoryID"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
            Category Name:
          </label>
          <input
            id="categoryName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategoryID">
            Subcategory ID:
          </label>
          <input
            id="subcategoryID"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={subcategoryID}
            onChange={(e) => setSubcategoryID(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategoryName">
            Subcategory Name:
          </label>
          <input
            id="subcategoryName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Category and Subcategory
          </button>
        </div>
      </form>
      {/* <CategoriesAndSubCategoriesList/> */}
      <AddSubCategories/>
      </div>
    </div>
  );
};

export default AddCategories;
