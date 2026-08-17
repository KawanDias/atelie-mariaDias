import { db } from './firebase';

import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';

import type {
    Product,
    ProductCategory,
} from '../types';

const COLLECTION_NAME = 'produtos';

// =====================================================
// CATEGORIAS VÁLIDAS
// =====================================================

const CATEGORIES: ProductCategory[] = [
    'Enxoval de Bebê',
    'Batizado',
    'Toalhas Personalizadas',
    'Acessórios & Maternidade',
    'Decoração do Quartinho',
];

// =====================================================
// VALIDAR CATEGORIA
// =====================================================

const getValidCategory = (
    category: unknown
): ProductCategory => {
    if (
        typeof category === 'string' &&
        CATEGORIES.includes(
            category as ProductCategory
        )
    ) {
        return category as ProductCategory;
    }

    return 'Enxoval de Bebê';
};

// =====================================================
// BUSCAR PRODUTOS
// =====================================================

export async function getProducts(): Promise<Product[]> {
    try {
        const productsRef = collection(
            db,
            COLLECTION_NAME
        );

        const snapshot =
            await getDocs(productsRef);

        const products: Product[] =
            snapshot.docs.map(docSnap => {
                const data = docSnap.data();

                const images = Array.isArray(
                    data.images
                )
                    ? data.images.filter(
                          (
                              image
                          ): image is string =>
                              typeof image ===
                              'string'
                      )
                    : [];

                const image =
                    typeof data.image ===
                    'string'
                        ? data.image
                        : images[0];

                return {
                    id: docSnap.id,

                    title:
                        typeof data.title ===
                        'string'
                            ? data.title
                            : '',

                    description:
                        typeof data.description ===
                        'string'
                            ? data.description
                            : '',

                    category:
                        getValidCategory(
                            data.category
                        ),

                    price:
                        typeof data.price ===
                        'string'
                            ? data.price
                            : '',

                    images,

                    image,

                    featured:
                        data.featured === true,

                    measurements:
                        typeof data.measurements ===
                        'string'
                            ? data.measurements
                            : '',
                };
            });

        return products;

    } catch (error) {
        console.error(
            'ERRO AO BUSCAR PRODUTOS:',
            error
        );

        throw error;
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
            if (!product.id) {
                continue;
            }

            const productRef = doc(
                db,
                COLLECTION_NAME,
                String(product.id)
            );

            await setDoc(
                productRef,
                {
                    title: product.title,
                    description:
                        product.description,

                    category:
                        product.category,

                    price: product.price,

                    images:
                        product.images ?? [],

                    image:
                        product.image ??
                        product.images?.[0] ??
                        '',

                    featured:
                        product.featured ?? false,

                    measurements:
                        product.measurements ?? '',
                },
                {
                    merge: true,
                }
            );
        }

    } catch (error) {
        console.error(
            'ERRO AO SALVAR PRODUTOS:',
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
            title: newProduct.title,

            description:
                newProduct.description,

            category:
                newProduct.category,

            price: newProduct.price,

            images:
                newProduct.images ?? [],

            image:
                newProduct.image ??
                newProduct.images?.[0] ??
                '',

            featured:
                newProduct.featured ?? false,

            measurements:
                newProduct.measurements ?? '',

            createdAt:
                serverTimestamp(),
        };

        const productsRef =
            collection(
                db,
                COLLECTION_NAME
            );

        const docRef =
            await addDoc(
                productsRef,
                dataToAdd
            );

        return {
            id: docRef.id,

            title: dataToAdd.title,

            description:
                dataToAdd.description,

            category:
                dataToAdd.category,

            price: dataToAdd.price,

            images:
                dataToAdd.images,

            image:
                dataToAdd.image,

            featured:
                dataToAdd.featured,

            measurements:
                dataToAdd.measurements,
        };

    } catch (error) {
        console.error(
            'ERRO AO ADICIONAR PRODUTO:',
            error
        );

        throw error;
    }
}

// =====================================================
// ATUALIZAR PRODUTO
// =====================================================

export async function updateProduct(
    id: string,
    updatedData: Partial<Product>
): Promise<Product> {
    try {
        const productRef = doc(
            db,
            COLLECTION_NAME,
            String(id)
        );

        const dataToUpdate = {
            ...(updatedData.title !==
            undefined && {
                title:
                    updatedData.title,
            }),

            ...(updatedData.description !==
            undefined && {
                description:
                    updatedData.description,
            }),

            ...(updatedData.category !==
            undefined && {
                category:
                    updatedData.category,
            }),

            ...(updatedData.price !==
            undefined && {
                price:
                    updatedData.price,
            }),

            ...(updatedData.images !==
            undefined && {
                images:
                    updatedData.images,
            }),

            ...(updatedData.image !==
            undefined && {
                image:
                    updatedData.image,
            }),

            ...(updatedData.featured !==
            undefined && {
                featured:
                    updatedData.featured,
            }),

            ...(updatedData.measurements !==
            undefined && {
                measurements:
                    updatedData.measurements,
            }),
        };

        await updateDoc(
            productRef,
            dataToUpdate
        );

        return {
            id,

            title:
                updatedData.title ?? '',

            description:
                updatedData.description ?? '',

            category:
                updatedData.category ??
                'Enxoval de Bebê',

            price:
                updatedData.price ?? '',

            images:
                updatedData.images ?? [],

            image:
                updatedData.image ??
                updatedData.images?.[0],

            featured:
                updatedData.featured ??
                false,

            measurements:
                updatedData.measurements ??
                '',
        };

    } catch (error) {
        console.error(
            'ERRO AO ATUALIZAR PRODUTO:',
            error
        );

        throw error;
    }
}

// =====================================================
// DELETAR PRODUTO
// =====================================================

export async function deleteProduct(
    id: string
): Promise<string> {
    try {
        const productRef = doc(
            db,
            COLLECTION_NAME,
            String(id)
        );

        await deleteDoc(
            productRef
        );

        return id;

    } catch (error) {
        console.error(
            'ERRO AO DELETAR PRODUTO:',
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
    try {
        const currentProducts =
            await getProducts();

        if (
            currentProducts.length === 0
        ) {
            await saveProducts(
                defaultProducts
            );
        }

    } catch (error) {
        console.error(
            'ERRO AO INICIALIZAR PRODUTOS:',
            error
        );

        throw error;
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