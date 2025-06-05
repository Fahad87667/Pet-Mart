import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCart(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateQuantity = async (code, quantity) => {
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeProduct = async (code) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error("Failed to remove product");
      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const proceedToCheckout = () => {
    navigate("/shoppingCartCustomer");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!cart || cart.cartLines.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <button
          onClick={() => navigate("/productList")}
          className="button-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.cartLines.map((line) => (
          <div key={line.product.code} className="cart-item">
            <img
              src={`/productImage?code=${line.product.code}`}
              alt={line.product.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{line.product.name}</h3>
              <p className="price">${line.product.price}</p>
              <div className="quantity-controls">
                <button
                  onClick={() =>
                    updateQuantity(line.product.code, line.quantity - 1)
                  }
                  disabled={line.quantity <= 1}
                >
                  -
                </button>
                <span>{line.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(line.product.code, line.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeProduct(line.product.code)}
                className="button-secondary"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ${cart.amountTotal}</h3>
        <button onClick={proceedToCheckout} className="button-primary">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
