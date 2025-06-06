import api from "./api"; // Import the api instance

export const getUserReservations = async () => {
  try {
    console.log("Fetching user reservations...");
    // Make a GET request to the new backend endpoint
    const response = await api.get("/reservations/me");
    console.log("Reservations fetched:", response.data);
    return response.data; // Return the list of reservations
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    // Return an empty array or re-throw the error, depending on desired behavior
    throw error; // Re-throw the error so the component can handle it
  }
};
