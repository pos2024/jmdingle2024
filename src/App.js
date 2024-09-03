import React, { useEffect, useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom'; // Use HashRouter
import Login from './components/Login';
import RootLayout from './pages/Root';
import CategoriesAndSubPage from './pages/CategoriesAndSubPage';
import Home from './pages/Home';
import AddProduct from './components/AddProduct';
import Transfer from './components/Transfer';
import ProductList from './components/ProductList';
import Sales from './components/Sales';

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
    setLoading(false); // Ensure loading is handled after fetching the user role
  }, []);

  // Define routers
  const adminRouter = createHashRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <ProductList /> },
        { path: '/addcategories', element: <CategoriesAndSubPage /> },
        { path: '/addproduct', element: <AddProduct /> },
        { path: '/transfer', element: <Transfer /> },
        { path: '/sales', element: <Sales /> }
      ],
    },
  ]);

  const staffRouter = createHashRouter([
    {
      path: '/',
      element: <Home />,
    },
  ]);

  if (loading) {
    return <div>Loading...</div>; // Add a loading state
  }

  // Conditional rendering based on user role
  return (
    <>
      {userRole === null ? (
        <Login /> // Render Login if no userRole is set
      ) : (
        <RouterProvider router={userRole === 'admin' ? adminRouter : staffRouter} />
      )}
    </>
  );
};

export default App;
