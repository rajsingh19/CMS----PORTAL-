import axios from "axios";

const API_URL = "/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export const getProducts = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });

    const url = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const res = await apiClient.get(url);
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const res = await apiClient.post('/products', productData);
    return res.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await apiClient.put(`/products/${id}`, productData);
    return res.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
