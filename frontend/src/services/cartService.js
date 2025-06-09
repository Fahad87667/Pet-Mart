import api from "./api";

const cartService = {
  async getCart() {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { cartLines: [], quantityTotal: 0, amountTotal: 0 };
      }
      console.error("Error fetching cart:", error);
      return { cartLines: [], quantityTotal: 0, amountTotal: 0 };
    }
  },

  async addToCart(productCode, quantity) {
    try {
      const response = await api.post("/cart/add", {
        code: productCode,
        quantity,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Please sign in to add items to cart");
      }
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  async updateCartItem(productCode, quantity) {
    try {
      const response = await api.put("/cart/update", {
        code: productCode,
        quantity,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Please sign in to update cart");
      }
      console.error("Error updating cart:", error);
      throw error;
    }
  },

  async removeFromCart(productCode) {
    try {
      const response = await api.post("/cart/remove", {
        code: productCode,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Please sign in to remove items from cart");
      }
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const response = await api.delete("/cart");
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // User is not authenticated
        throw new Error("AUTHENTICATION_REQUIRED");
      } else {
        console.error("Error clearing cart:", error);
        throw error.response?.data || error.message;
      }
    }
  },

  async checkout(customerInfo) {
    const response = await api.post("/cart/checkout", customerInfo);
    return response.data;
  },
};

export { cartService };
