import { db } from './firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
} from 'firebase/firestore';
import type { Product } from '../types';

const COLLECTION_NAME = 'produtos';

// =====================================================
// BUSCAR PRODUTOS
// =====================================================

export async function getProducts(): Promise<Product[]> {
    try {
        const snapshot = await getDocs(
            collection(db, COLLECTION_NAME)
        );

        return snapshot.docs.map(docSnap => ({
            ...docSnap.data(),
            id: docSnap.id,
        })) as unknown as Product[];

    } catch (error) {
        console.error(
            'Erro ao buscar produtos:',
            error
        );

        return [];
    }
}

// =====================================================
// SALVAR PRODUTOS PADRÃO
// =====================================================

export async function saveProducts(
    products: Product[]
): Promise<void> {
    try {
        for (const product of products) {
            if (
                product.id === undefined ||
                product.id === null
            ) {
                continue;
            }

            await setDoc(
                doc(
                    db,
                    COLLECTION_NAME,
                    String(product.id)
                ),
                product,
                { merge: true }
            );
        }

    } catch (error) {
        console.error(
            'Erro ao salvar produtos no Firestore:',
            error
        );

        throw error;
    }
}

// =====================================================
// ADICIONAR PRODUTO
// =====================================================

export async function addProduct(
    newProduct: Omit<Product, 'id'>
): Promise<Product> {
    try {
        const dataToAdd = {
            ...newProduct,
            createdAt: new Date(),
        };

        const docRef = await addDoc(
            collection(db, COLLECTION_NAME),
            dataToAdd
        );

        return {
            ...dataToAdd,
            id: docRef.id,
        } as unknown as Product;

    } catch (error) {
        console.error(
            'Erro ao adicionar produto:',
            error
        );

        throw error;
    }
}

// =====================================================
// ATUALIZAR PRODUTO
// =====================================================

export async function updateProduct(
    id: number | string,
    updatedData: Partial<Product>
): Promise<Product> {
    try {
        const docRef = doc(
            db,
            COLLECTION_NAME,
            String(id)
        );

        await updateDoc(
            docRef,
            updatedData as Record<string, unknown>
        );

        return {
            ...updatedData,
            id,
        } as unknown as Product;

    } catch (error) {
        console.error(
            'Erro ao atualizar produto:',
            error
        );

        throw error;
    }
}

// =====================================================
// DELETAR PRODUTO
// =====================================================

export async function deleteProduct(
    id: number | string
): Promise<string | number> {
    try {
        await deleteDoc(
            doc(
                db,
                COLLECTION_NAME,
                String(id)
            )
        );

        return id;

    } catch (error) {
        console.error(
            'Erro ao deletar produto:',
            error
        );

        throw error;
    }
}

// =====================================================
// INICIALIZAR PRODUTOS PADRÃO
// =====================================================

export async function initializeDefaultProducts(
    defaultProducts: Product[]
): Promise<void> {
    const current = await getProducts();

    if (current.length === 0) {
        await saveProducts(defaultProducts);
    }
}

// =====================================================
// SERVIÇO
// =====================================================

export const productService = {
    getProducts,
    saveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    initializeDefaultProducts,
};