import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL; // use environment variable

// ...existing code...
export async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`, {
    cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
  });
  return res.json();
}
// ...existing code...
