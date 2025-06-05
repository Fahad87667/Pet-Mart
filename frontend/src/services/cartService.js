import api from "./api";

const cartService = {
  async getCart() {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
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
      if (error.response && error.response.status === 401) {
        // User is not authenticated
        throw new Error("AUTHENTICATION_REQUIRED");
      } else {
        console.error("Error adding to cart:", error);
        throw error.response?.data || error.message;
      }
    }
  },

  async updateCartItem(productCode, quantity) {
    try {
      const response = await api.put("/cart/update", { productCode, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async removeFromCart(productCode) {
    try {
      const response = await api.post(`/cart/remove`, { code: productCode });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // User is not authenticated
        throw new Error("AUTHENTICATION_REQUIRED");
      } else {
        console.error("Error removing from cart:", error);
        throw error.response?.data || error.message;
      }
    }
  },

  async clearCart() {
    try {
      const response = await api.post("/cart/clear");
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
