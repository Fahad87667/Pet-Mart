import api from "./api";

export async function login(email, password) {
  try {
    const response = await api.post("/signin", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Failed to login");
  }
}

export async function register(userData) {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw new Error(error.response?.data?.message || "Failed to register");
  }
}

export async function logout() {
  try {
    await api.post("/signout");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export function isAuthenticated() {
  // Since we're using session-based auth, we'll rely on the backend to tell us
  // if the user is authenticated via the /user endpoint
  return false; // This will be updated by the App component based on getCurrentUser()
}

export function getUser() {
  // Since we're using session-based auth, we'll rely on the backend to provide
  // user information via the /user endpoint
  return null; // This will be updated by the App component based on getCurrentUser()
}
 