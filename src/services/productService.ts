import type { Product } from '../types';

const STORAGE_KEY = 'atelie_products';

export function getProducts(): Product[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

export function addProduct(product: Omit<Product, 'id'>): Product {
    const products = getProducts();
    const newProduct: Product = {
        ...product,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return newProduct;
}

export function updateProduct(id: number, updates: Partial<Product>): Product | null {
    const products = getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated = { ...products[index], ...updates };
    products[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return updated;
}

export function deleteProduct(id: number): boolean {
    const products = getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

export function initializeDefaultProducts(defaultProducts: Product[]) {
    const existing = getProducts();
    if (existing.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    }
}
