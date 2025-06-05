import api from "./api";

export const authService = {
  async getCurrentUser() {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  async login(email, password) {
    try {
      const response = await api.post("/signin", { email, password });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post("/signout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};
