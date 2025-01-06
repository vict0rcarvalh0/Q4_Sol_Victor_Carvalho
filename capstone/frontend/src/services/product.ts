import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const createProduct = async (productData: unknown) => {
  try {
    const response = await axios.post(`${BASE_URL}/product`, productData);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to create product";

    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      if (error.response?.status === 400) {
        errorMessage = "Invalid product data.";
      } else if (backendMessage) {
        errorMessage = backendMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const getProduct = async (productId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${productId}`);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to fetch product";
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        errorMessage = backendMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const getProductByFarmer = async (farmerId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/farmer/${farmerId}`);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to fetch product";
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        errorMessage = backendMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const updateProduct = async (
  productId: number,
  productData: unknown
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/product/${productId}`,
      productData
    );
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to update product";

    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        errorMessage = backendMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/product/${productId}`);
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to delete product";

    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        errorMessage = backendMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
