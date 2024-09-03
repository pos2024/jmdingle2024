import React, { useState, useEffect } from 'react';
import db from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Modal from '../pages/Modal'; 

const AddSubCategories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subcategoryName, setSubcategoryName] = useState('');
    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          // Fetch categories from Firestore
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
  
    const handleAddSubcategory = async () => {
      if (!selectedCategory || !subcategoryName) return;
  
      try {
        // Add subcategory to Firestore
        await addDoc(collection(db, 'categories', selectedCategory.id, 'children'), {
          name: subcategoryName,
        });
        setShowModal(false);
        setSubcategoryName('');
      } catch (error) {
        console.error('Error adding subcategory: ', error);
      }
    };
  
    return (
      
      <div className=" bg-white mx-auto  p-8 grid grid-cols-4 gap-3">
        {categories.map(category => (
          <div key={category.id} className=" shadow-md rounded-md p-4">
            <div className="mb-4">
              <h2 className="text-xl text-gray-700 font-bold mb-2">{category.name}</h2>
              <ul>
                {category.children && category.children.map(subcategory => (
                  <li className='' key={subcategory.id}>{subcategory.name}</li>
                ))}
              </ul>
              <button onClick={() => { setSelectedCategory(category); setShowModal(true); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
                Add Subcategory
              </button>
            </div>
          </div>
        ))}
        {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Add Subcategory</h2>
              <input type="text" value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 mb-4 w-full" />
              <button onClick={handleAddSubcategory} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add Subcategory
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
};

export default AddSubCategories;
