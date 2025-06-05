import api from "./api";

export const productService = {
  async getProducts(page = 0, size = 100, searchTerm = "") {
    try {
      const response = await api.get("/products", {
        params: {
          page,
          size,
          name: searchTerm,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error.response?.data || error.message;
    }
  },

  async getProduct(code) {
    try {
      const response = await api.get(`/products/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with code ${code}:`, error);
      throw error.response?.data || error.message;
    }
  },

  getProductImage(code) {
    // Return full URL for product image
    return `${api.defaults.baseURL}/productImage?code=${encodeURIComponent(
      code
    )}`;
  },
};
