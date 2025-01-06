import axios from "axios";
import { setStoredUser } from "@/utils/storage";

const BASE_URL = "http://localhost:5000";

export const createFarmer = async (farmerData: {
  email: string;
  wallet_address: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/farmer`, farmerData);
    
    const farmer = response.data;
    setStoredUser(farmer);

    return response.data;
  } catch (error) {
    let errorMessage = "Failed to create farmer";

    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      if (error.response?.status === 500 || backendMessage?.includes("RowNotFound")) {
        errorMessage = "This email or wallet is already registered.";
      } else if (backendMessage) {
        errorMessage = backendMessage;
      }
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

export const getFarmerByWalletAddress = async (walletAddress: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/farmer/wallet/${walletAddress}`);

    const farmer = response.data;
    setStoredUser(farmer);
    
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
