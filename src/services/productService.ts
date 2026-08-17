import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  getDoc 
} from 'firebase/firestore';
import type { Product } from '../types';

const COLLECTION_NAME = 'produtos';

// =====================================================
// BUSCAR TODOS OS PRODUTOS (Leitura Única)
// =====================================================
export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const products: Product[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        ...data,
        id: docSnap.id, // Garante que o ID do documento Firestore está no objeto
      } as unknown as Product);
    });

    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

// =====================================================
// SALVAR MÚLTIPLOS PRODUTOS (Para inicialização)
// =====================================================
export async function saveProducts(products: Product[]): Promise<void> {
  try {
    for (const product of products) {
      if (product.id !== undefined && product.id !== null) {
        const docRef = doc(db, COLLECTION_NAME, String(product.id));
        // merge: true garante que não substitua o documento inteiro se ele já existir
        await setDoc(docRef, product, { merge: true });
      }
    }
  } catch (error) {
    console.error('Erro ao salvar produtos no Firestore:', error);
    throw error;
  }
}

// =====================================================
// ADICIONAR UM NOVO PRODUTO (Corrigido)
// =====================================================
// Retorna o produto criado (com o ID correto), permitindo atualização local no front-end.
export async function addProduct(newProduct: Product): Promise<Product> {
  try {
    let finalProduct: Product;

    // Se o Front-end já gerou um ID (ex: Date.now() usado na AdminPage)
    if (newProduct.id) {
      const docRef = doc(db, COLLECTION_NAME, String(newProduct.id));
      await setDoc(docRef, newProduct);
      finalProduct = newProduct;
    } else {
      // Se o Firebase deve gerar o ID automaticamente (addDoc)
      const dataToAdd = {
        ...newProduct,
        createdAt: new Date(), // Boa prática adicionar data de criação
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToAdd);
      
      // Criamos o objeto final combinando o ID gerado pelo Firebase com os dados
      finalProduct = {
        ...dataToAdd,
        id: docRef.id,
      } as unknown as Product;
    }

    // Retorna APENAS o produto criado
    return finalProduct; 

  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    // Propaga o erro para o componente React capturar e tratar
    throw error; 
  }
}

// =====================================================
// ATUALIZAR UM PRODUTO (Corrigido)
// =====================================================
// Retorna os dados atualizados e o ID para o front-end fazer o merge localmente.
export async function updateProduct(
  id: number | string, 
  updatedData: Partial<Product>
): Promise<Partial<Product> & { id: string | number }> {
  try {
    const docRef = doc(db, COLLECTION_NAME, String(id));
    await updateDoc(docRef, updatedData as { [x: string]: any });
    
    return {
      ...updatedData,
      id,
    } as unknown as Partial<Product> & { id: string | number };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

// =====================================================
// DELETAR UM PRODUTO (Corrigido)
// =====================================================
// Retorna o ID deletado para o front-end remover localmente.
export async function deleteProduct(id: number | string): Promise<string | number> {
  try {
    const docRef = doc(db, COLLECTION_NAME, String(id));
    await deleteDoc(docRef);
    
    // Retorna o ID que foi deletado
    return id; 

  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}

// =====================================================
// INICIALIZAR PRODUTOS PADRÃO
// =====================================================
export async function initializeDefaultProducts(defaultProducts: Product[]): Promise<void> {
  // Busca a lista atual primeiro (para não duplicar)
  const current = await getProducts();
  if (current.length === 0) {
    // Só salva os padrões se a coleção estiver vazia
    await saveProducts(defaultProducts);
  }
}

// =====================================================
// Objeto agrupado para compatibilidade
// =====================================================
export const productService = {
  getProducts,
  saveProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  initializeDefaultProducts,
};