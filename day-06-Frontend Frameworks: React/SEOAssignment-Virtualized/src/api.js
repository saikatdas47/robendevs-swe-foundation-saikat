const BASE_URL = 'https://dummyjson.com/products';
export const BATCH_SIZE = 10;

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(response.status === 404 ? 'Product not found.' : 'Could not load products. Please try again.');
  }
  return response.json();
}

export function getProducts(skip, signal) {
  return fetchJson(`${BASE_URL}?limit=${BATCH_SIZE}&skip=${skip}&select=id,title,price,rating,thumbnail,category,discountPercentage`, signal);
}

export function getProduct(id, signal) {
  return fetchJson(`${BASE_URL}/${encodeURIComponent(id)}`, signal);
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}
