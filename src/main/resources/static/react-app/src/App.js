import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ShoppingCart from "./components/ShoppingCart";
import Navbar from "./components/Navbar";
import { authService } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} user={user} />
        <Routes>
          <Route path="/" element={<Navigate to="/productList" />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/productList"
            element={
              isAuthenticated ? <ProductList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/shoppingCart"
            element={
              isAuthenticated ? <ShoppingCart /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
