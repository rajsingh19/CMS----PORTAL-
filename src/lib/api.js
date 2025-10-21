import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const getProducts = async (params = {}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const url = `${API_URL}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const res = await axios.get(url);
  return res.data;
};

export const getProduct = async (id) => {
  const res = await axios.get(`${API_URL}/products/${id}`);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await axios.post(`${API_URL}/products`, productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await axios.put(`${API_URL}/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/products/${id}`);
  return res.data;
};
