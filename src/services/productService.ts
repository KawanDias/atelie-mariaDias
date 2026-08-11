import localforage from 'localforage';
import { Product } from '../types';

const PRODUCTS_KEY = 'atelie_products';

localforage.config({
  name: 'AtelieMariaDias',
  storeName: 'products_store'
});

// Funções individuais exportadas para compatibilidade com o resto do site
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await localforage.getItem<Product[]>(PRODUCTS_KEY);
    return products || [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await localforage.setItem(PRODUCTS_KEY, products);
}

export async function addProduct(newProduct: Product): Promise<Product[]> {
  const products = await getProducts();
  const updatedProducts = [newProduct, ...products];
  await saveProducts(updatedProducts);
  return updatedProducts;
}

export async function updateProduct(id: number, updatedData: Partial<Product>): Promise<Product[]> {
  const products = await getProducts();
  const updatedProducts = products.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
  await saveProducts(updatedProducts);
  return updatedProducts;
}

export async function deleteProduct(id: number): Promise<Product[]> {
  const products = await getProducts();
  const updatedProducts = products.filter((p) => p.id !== id);
  await saveProducts(updatedProducts);
  return updatedProducts;
}

export async function initializeDefaultProducts(defaultProducts: Product[]): Promise<void> {
  const current = await getProducts();
  if (current.length === 0) {
    await saveProducts(defaultProducts);
  }
}

// Objeto agrupado caso algum arquivo use productService
export const productService = {
  getProducts,
  saveProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  initializeDefaultProducts,
};