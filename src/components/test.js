import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase'; // Adjust the import path as necessary

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [totalSellingPrice, setTotalSellingPrice] = useState(0);
  const [totalWholesalePrice, setTotalWholesalePrice] = useState(0);
  const [profit, setProfit] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSalesAndProducts = async () => {
      try {
        // Fetch sales data
        const salesRef = collection(db, 'sales');
        const salesSnapshot = await getDocs(salesRef);
        const salesData = salesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch products data
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          wholesalePrice: Number(doc.data().wholesalePrice) || 0 // Ensure it's a number
        }));
        setProducts(productsData);

        // Log products data to verify
        console.log('Fetched Products Data:', productsData);

        // Initialize totals
        let sellingPriceSum = 0;
        let wholesalePriceSum = 0;

        // Calculate totals
        for (const sale of salesData) {
          if (sale.items && Array.isArray(sale.items)) {
            for (const item of sale.items) {
              const itemPrice = parseFloat(item.price) || 0;
              const itemQuantity = parseInt(item.quantity) || 0;
              const itemBarcode = item.barcode || 'undefined'; // Ensure item.barcode is available

              // Debug logging for item
              console.log('Processing Item:', item);
              console.log('Item Price:', itemPrice);
              console.log('Item Quantity:', itemQuantity);
              console.log('Item Barcode:', itemBarcode);

              // Find product based on item barcode
              const product = productsData.find(p => p.barcode === itemBarcode);

              // Debug logging to check if product is found and has correct wholesalePrice
              if (product) {
                console.log('Product Found:', product);
                console.log('Product Barcode:', product.barcode);
                console.log('Product Wholesale Price:', product.wholesalePrice);
              } else {
                console.warn('Product not found for barcode:', itemBarcode);
              }

              const itemWholesalePrice = product ? product.wholesalePrice : 0;

              // Debug logging to check values
              console.log('Item:', item);
              console.log('Item Price:', itemPrice);
              console.log('Item Wholesale Price:', itemWholesalePrice);
              console.log('Item Quantity:', itemQuantity);

              // Calculate totals
              sellingPriceSum += itemPrice; // Total selling price
              wholesalePriceSum += itemWholesalePrice * itemQuantity; // Total wholesale price
            }
          } else {
            console.warn('Invalid sale items structure:', sale.items);
          }
        }

        setSales(salesData);
        setTotalSellingPrice(sellingPriceSum);
        setTotalWholesalePrice(wholesalePriceSum);
        setProfit(sellingPriceSum - wholesalePriceSum);

      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesAndProducts();
  }, []); // No dependencies, run once

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Items</th>
              <th className="py-2 px-4 border-b">Total Amount</th>
              <th className="py-2 px-4 border-b">Cash Received</th>
              <th className="py-2 px-4 border-b">Change</th>
              <th className="py-2 px-4 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {currentSales.map(sale => (
              <tr key={sale.id} className="text-center">
                <td className="py-2 px-4 border-b">{sale.id}</td>
                <td className="py-2 px-4 border-b">
                  {sale.items && Array.isArray(sale.items) ? (
                    sale.items.map((item, index) => (
                      <div key={index}>
                        {item.name} (x{item.quantity || 0}) - ₱{(item.price || 0).toFixed(2)}
                      </div>
                    ))
                  ) : (
                    <div>No items available</div>
                  )}
                </td>
                <td className="py-2 px-4 border-b">₱{(sale.totalAmount || 0).toFixed(2)}</td>
                <td className="py-2 px-4 border-b">₱{(sale.cashReceived || 0).toFixed(2)}</td>
                <td className="py-2 px-4 border-b">₱{(sale.change || 0).toFixed(2)}</td>
                <td className="py-2 px-4 border-b">
                  {sale.timestamp ? new Date(sale.timestamp.toDate()).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages).keys()].map(page => (
          <button
            key={page + 1}
            onClick={() => paginate(page + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Summary</h2>
        <div className="mt-2">
          <p>Total Selling Price: <span className="font-semibold">₱{totalSellingPrice.toFixed(2)}</span></p>
          <p>Total Wholesale Price: <span className="font-semibold">₱{totalWholesalePrice.toFixed(2)}</span></p>
          <p>Profit: <span className="font-semibold text-green-600">₱{profit.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Sales;
