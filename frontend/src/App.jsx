import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/HeaderComponent";
import Footer from "./components/FooterComponent";
import Home from "./pages/Home";
import FindPet from "./pages/FindPet";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import ReservationStatus from "./pages/ReservationStatus";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import "bootstrap-icons/font/bootstrap-icons.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap";
import { getCurrentUser } from "./services/authService";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setUserName(`${user.firstName} ${user.lastName}`);
          setIsAdmin(user.role === "ROLE_ADMIN");
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setUserName("");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserName("");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const updateAuthState = (user) => {
    if (user) {
      setIsLoggedIn(true);
      setUserName(`${user.firstName} ${user.lastName}`);
      setIsAdmin(user.role === "ROLE_ADMIN");
      triggerCartUpdate();
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserName("");
      triggerCartUpdate();
    }
  };

  const triggerCartUpdate = () => {
    setCartUpdateTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          userName={userName}
          updateAuthState={updateAuthState}
          cartUpdateTrigger={cartUpdateTrigger}
        />
        <Container fluid className="flex-grow-1 mt-4 mb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/find-pet"
              element={
                <FindPet
                  onAddToCartSuccess={triggerCartUpdate}
                  isAdmin={isAdmin}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/cart"
              element={<Cart onAddToCartSuccess={triggerCartUpdate} />}
            />
            <Route
              path="/admin"
              element={<Admin isLoggedIn={isLoggedIn} isAdmin={isAdmin} />}
            />
            <Route
              path="/register"
              element={<Register updateAuthState={updateAuthState} />}
            />
            <Route
              path="/signin"
              element={<SignIn updateAuthState={updateAuthState} />}
            />
            <Route
              path="/product/:code"
              element={<ProductDetails onAddToCartSuccess={triggerCartUpdate} />}
            />
            <Route
              path="/checkout"
              element={<Checkout onAddToCartSuccess={triggerCartUpdate} />}
            />
            <Route path="/reservation-status" element={<ReservationStatus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add more routes here as needed */}
          </Routes>
        </Container>
        <Footer />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
