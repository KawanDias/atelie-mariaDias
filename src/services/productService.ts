import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import type { Product } from '../types';

const COLLECTION_NAME = 'produtos';

// Funções individuais exportadas para compatibilidade
export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const products: Product[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        ...data,
        id: docSnap.id,
      } as unknown as Product);
    });

    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    for (const product of products) {
      if (product.id !== undefined && product.id !== null) {
        const docRef = doc(db, COLLECTION_NAME, String(product.id));
        await setDoc(docRef, product, { merge: true });
      }
    }
  } catch (error) {
    console.error('Erro ao salvar produtos no Firestore:', error);
  }
}

export async function addProduct(newProduct: Product): Promise<Product[]> {
  try {
    if (newProduct.id) {
      const docRef = doc(db, COLLECTION_NAME, String(newProduct.id));
      await setDoc(docRef, newProduct);
    } else {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...newProduct,
        createdAt: new Date(),
      });
    }
    return await getProducts();
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return await getProducts();
  }
}

export async function updateProduct(id: number | string, updatedData: Partial<Product>): Promise<Product[]> {
  try {
    const docRef = doc(db, COLLECTION_NAME, String(id));
    await updateDoc(docRef, updatedData);
    return await getProducts();
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return await getProducts();
  }
}

export async function deleteProduct(id: number | string): Promise<Product[]> {
  try {
    const docRef = doc(db, COLLECTION_NAME, String(id));
    await deleteDoc(docRef);
    return await getProducts();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return await getProducts();
  }
}

export async function initializeDefaultProducts(defaultProducts: Product[]): Promise<void> {
  const current = await getProducts();
  if (current.length === 0) {
    await saveProducts(defaultProducts);
  }
}

// Objeto agrupado para compatibilidade
export const productService = {
  getProducts,
  saveProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  initializeDefaultProducts,
};