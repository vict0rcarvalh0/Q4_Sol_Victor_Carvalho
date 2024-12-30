import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const createFarmer = async (farmerData: {
  email: string;
  wallet_address: string;
}) => {
  try {
    console.log(farmerData);
    const response = await axios.post(`${BASE_URL}/farmer`, farmerData);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to create farmer";
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message; // Backend-specific error message
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const getFarmer = async (farmerId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer/${farmerId}`);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to fetch farmer";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const updateFarmer = async (farmerId: number, farmerData: unknown) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/farmer/${farmerId}`,
      farmerData
    );
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to update farmer";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const deleteFarmer = async (farmerId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/farmer/${farmerId}`);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to delete farmer";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};
