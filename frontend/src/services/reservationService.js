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

export const getActiveReservations = async () => {
  try {
    console.log("Fetching active reservations...");
    const response = await api.get("/reservations/me/active");
    console.log("Active reservations fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching active reservations:", error);
    throw error;
  }
};

export const withdrawReservation = async (reservationId) => {
  try {
    const response = await api.delete(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("Error withdrawing reservation:", error);
    throw error;
  }
};

export const clearCompletedReservations = async () => {
  try {
    // Instead of deleting, just fetch active reservations
    const response = await getActiveReservations();
    return response;
  } catch (error) {
    console.error("Error clearing completed reservations:", error);
    throw error;
  }
};
