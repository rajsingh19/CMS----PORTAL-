import axios from "axios";

const STRAPI_URL = "http://localhost:1337";

export const getProducts = async () => {
  const res = await axios.get(`${STRAPI_URL}/api/products?populate=*`);
  return res.data.data;
};
