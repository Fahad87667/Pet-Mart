import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import FindPet from "./pages/FindPet";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-pet" element={<FindPet />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
