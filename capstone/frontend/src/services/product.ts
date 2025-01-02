import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const productService = {
  createProduct: async (productData: unknown) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create product";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  },

  getProduct: async (productId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch product";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  },

  updateProduct: async (productId: number, productData: unknown) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update product";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  },

  deleteProduct: async (productId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`);
    } catch (error) {
      let errorMessage = "Failed to delete product";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  },
};
