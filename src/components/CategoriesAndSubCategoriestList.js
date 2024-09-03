import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import db from '../firebase';

const CategoriesAndSubCategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subCategoriesLoaded, setSubCategoriesLoaded] = useState(false);

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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        console.log('Fetching subcategories...');
        console.log('Current categories:', categories);
        const subCategoriesPromises = categories.map(async category => {
          const subCategoriesRef = collection(db, 'categories', category.id, 'children');
          const subCategoriesSnapshot = await getDocs(subCategoriesRef);
          const subCategoriesData = subCategoriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          return { categoryId: category.id, subCategories: subCategoriesData };
        });
        const subCategoriesResults = await Promise.all(subCategoriesPromises);
        console.log('Subcategories fetched:', subCategoriesResults);
        setCategories(prevCategories => {
          const updatedCategories = prevCategories.map(category => ({
            ...category,
            children: subCategoriesResults.find(result => result.categoryId === category.id)?.subCategories
          }));
          return updatedCategories;
        });
        setSubCategoriesLoaded(true);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
  
    if (!loading && categories.length > 0 && !subCategoriesLoaded) {
      fetchSubCategories();
    }
  }, [loading, categories, subCategoriesLoaded]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-4 p-4 bg-white">
        {categories.map(category => (
          <div key={category.id} className="border rounded-md p-4">
            <h2 className="text-xl font-bold mb-2">{category.name}</h2>
            {subCategoriesLoaded && category.children && (
              <ul>
                {category.children.map(subcategory => (
                  <li className="text-sm" key={subcategory.id}>{subcategory.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesAndSubCategoriesList;
