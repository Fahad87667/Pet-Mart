import api from "./api";

export const adminService = {
  async addProduct(productData) {
    try {
      const response = await api.post("/admin/product", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Ensure credentials (cookies/session) are sent for auth, if needed:
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      // Throw backend error data if available, otherwise throw generic message
      throw error.response?.data || error.message;
    }
  },

  async updateProduct(productCode, productData) {
    try {
      const response = await api.put(
        `/admin/product/${productCode}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${productCode}:`, error);
      throw error.response?.data || error.message;
    }
  },

  async deleteProduct(productCode) {
    try {
      const response = await api.delete(`/admin/product/${productCode}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${productCode}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Add other admin related API calls here (e.g., get products, update product, delete product)
};
 