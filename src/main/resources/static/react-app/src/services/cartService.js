import api from "./api";

export const cartService = {
  async getCart() {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return null;
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
      console.error("Error updating cart:", error);
      throw error;
    }
  },

  async removeFromCart(productCode) {
    try {
      const response = await api.post("/cart/remove", {
        code: productCode
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },
};
