import React, { useState, useEffect, useRef } from 'react';
import db from "../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import Table from './Table';
import Modal from '../pages/Modal';
import AddProduct from './AddProduct';
import UpdateProductForm from './updateProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const printRef = useRef(); // Ref for printable content

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setFilteredProducts(productsData);

      const uniqueCategories = [...new Set(productsData.map(product => product.categoryID))];
      setCategories(uniqueCategories);
    });

    return () => unsubscribe();
  }, []);

  // Handlers for action buttons
  const handleView = (id) => {
    console.log("View product with ID:", id);
    // Implement your view logic here
  };

  const handleUpdate = (id) => {
    const productToUpdate = products.find(product => product.id === id);
    setSelectedProduct(productToUpdate);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log("Delete product with ID:", id);
    // Implement your delete logic here
  };

  const handleSaveUpdate = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.categoryID === category);
      setFilteredProducts(filtered);
    }
  };

  // Handle print functionality
  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Category',
        accessor: 'categoryID',
      },
      {
        Header: 'Subcategory',
        accessor: 'categoryChildID',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Selling Price',
        accessor: 'sellingPrice',
      },
      {
        Header: 'Wholesale Price',
        accessor: 'wholesalePrice',
      },
      {
        Header: 'Total Selling Price',
        accessor: 'totalSellingPrice',
        Cell: ({ row }) => {
          return <span>P {row.original.sellingPrice * row.original.quantity}</span>;
        }
      },
      {
        Header: 'Total Wholesale Price',
        accessor: 'totalWholesalePrice',
        Cell: ({ row }) => {
          return <span>P {row.original.wholesalePrice * row.original.quantity}</span>;
        }
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <button 
                onClick={() => handleView(row.original.id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
              >
                View
              </button>
              <button 
                onClick={() => handleUpdate(row.original.id)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
              >
                Update
              </button>
              <button 
                onClick={() => handleDelete(row.original.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          );
        }
      },
    ],
    [filteredProducts]
  );

  const printableColumns = columns.filter(column => column.accessor !== 'actions');

  return (
    <div className="container mx-auto px-4 py-24 w-full">
      <div className='bg-white p-4 border-md'>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Product List</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Product
            </button>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button 
              onClick={handlePrint} 
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Print
            </button>
          </div>
        </div>
        <Table columns={columns} data={filteredProducts} />
      </div>

      {/* Printable Content */}
      <div ref={printRef} className="hidden">
        <Table columns={printableColumns} data={filteredProducts} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddProduct />
      </Modal>
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <UpdateProductForm product={selectedProduct} onSave={handleSaveUpdate} />
      </Modal>
    </div>
  );
};

export default ProductList;
