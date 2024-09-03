import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userRole === null ? (
        <Login />
      ) : (
        <Router>
          {userRole === 'admin' ? (
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route path="/" element={<ProductList />} />
                <Route path="/addcategories" element={<CategoriesAndSubPage />} />
                <Route path="/addproduct" element={<AddProduct />} />
                <Route path="/transfer" element={<Transfer />} />
                <Route path="/sales" element={<Sales />} />
              </Route>
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          )}
        </Router>
      )}
    </>
  );
};

export default App;
