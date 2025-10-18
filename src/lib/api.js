import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL; // use environment variable

export const getProducts = async () => {
  const res = await axios.get(`${STRAPI_URL}/api/products?populate=*`);
  return res.data; // full JSON including "data"
};
