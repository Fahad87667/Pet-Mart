import React, { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { cartService } from "../services/cartService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ product, onAddToCartSuccess, isAddedToCart, isAdmin, isLoggedIn }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingOrRemoving, setIsAddingOrRemoving] = useState(false);
  const navigate = useNavigate();

  const getPetTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case "DOG":
        return "#4CAF50";
      case "CAT":
        return "#2196F3";
      case "BIRD":
        return "#FF9800";
      default:
        return "#9C27B0";
    }
  };

  const getPetTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "DOG":
        return "🐕";
      case "CAT":
        return "🐱";
      case "BIRD":
        return "🦜";
      default:
        return "🐾";
    }
  };

  const handleCartAction = async () => {
    if (!isLoggedIn) {
      toast.info("Please sign in to add items to cart", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/signin")
      });
      return;
    }

    setIsAddingOrRemoving(true);
    try {
      if (isAddedToCart) {
        await cartService.removeFromCart(product.code);
        toast.error("Removed from cart!", {
          autoClose: 1000,
        });
      } else {
        await cartService.addToCart(product.code, 1);
        toast.success("Added to cart!", {
          autoClose: 1000,
        });
      }
      // Toggle the cart state after successful operation
      if (onAddToCartSuccess) {
        const updatedCart = await cartService.getCart();
        onAddToCartSuccess(updatedCart);
      }
    } catch (err) {
      toast.error(
        isAddedToCart ? "Failed to remove from cart" : "Failed to add to cart"
      );
    } finally {
      setIsAddingOrRemoving(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin?edit=${product.code}`);
  };

  const imageUrl = product.imagePath
    ? `http://localhost:8080${product.imagePath}`
    : "https://via.placeholder.com/400?text=No+Image";

  return (
    <div
      className="h-100"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0,0,0,0.15)"
          : "0 8px 25px rgba(0,0,0,0.1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pet Type Badge */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 2,
        }}
      >
        <Badge
          style={{
            background: getPetTypeColor(product.type),
            color: "white",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          {getPetTypeIcon(product.type)} {product.type}
        </Badge>
      </div>

      {/* Image Container */}
      <div
        style={{
          position: "relative",
          height: "280px",
          overflow: "hidden",
          borderRadius: "20px 20px 0 0",
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
            borderRadius: "0 0 20px 20px",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "24px" }}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "8px",
                fontSize: "1.25rem",
              }}
            >
              {product.name}
            </h5>
            {product.age && (
              <p
                style={{
                  color: "#7f8c8d",
                  fontSize: "14px",
                  marginBottom: "0",
                  fontWeight: "500",
                }}
              >
                Age: {product.age}
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#6366f1",
              }}
            >
              ₹{product.price?.toFixed(2) || "0.00"}
            </div>
            {isAdmin ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleEdit}
                style={{
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  fontWeight: "600",
                  borderColor: "#6366f1",
                  color: "#6366f1",
                }}
              >
                Edit Details
              </Button>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/product/${product.code}`)}
                  style={{
                    borderRadius: "20px",
                    padding: "0.5rem 1rem",
                    fontWeight: "600",
                    borderColor: "#6366f1",
                    color: "#6366f1",
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant={isAddedToCart ? "success" : "primary"}
                  size="sm"
                  onClick={handleCartAction}
                  disabled={isAddingOrRemoving}
                  style={{
                    borderRadius: "20px",
                    padding: "0.5rem 1rem",
                    fontWeight: "600",
                    background: isAddingOrRemoving
                      ? "#28a745"
                      : isAddedToCart
                      ? "#10b981"
                      : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    border: "none",
                    opacity: isAddingOrRemoving ? 0.6 : 1,
                  }}
                >
                  {isAddingOrRemoving
                    ? "Adding..."
                    : isAddedToCart
                    ? "Added to Cart"
                    : "Add to Cart"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div
          className="mb-3 p-3 rounded-3"
          style={{
            background: "rgba(102, 126, 234, 0.08)",
            border: "1px solid rgba(102, 126, 234, 0.1)",
          }}
        >
          <div className="row g-2 small">
            <div className="col-6">
              <strong style={{ color: "#667eea" }}>Code:</strong> {product.code}
            </div>
            <div className="col-6">
              <strong style={{ color: "#667eea" }}>Type:</strong> {product.type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
