import React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase';

const BackupProducts = () => {

  const handleBackup = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const jsonData = JSON.stringify(productsData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products_backup.json";
      a.click();
      window.URL.revokeObjectURL(url);

      console.log("Backup created successfully!");

    } catch (error) {
      console.error("Error creating backup: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Backup Products</h1>
        <p className="text-gray-600 mb-6">
       
        </p>
        <button 
          onClick={handleBackup} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Backup Products
        </button>
      </div>
    </div>
  );
};

export default BackupProducts;
