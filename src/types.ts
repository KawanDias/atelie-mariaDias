export type ProductCategory =
    | 'Enxoval de Bebê'
    | 'Batizado'
    | 'Toalhas Personalizadas'
    | 'Acessórios & Maternidade'
    | 'Decoração do Quartinho';

export interface Product {
    id: string;
    title: string;
    description: string;
    category: ProductCategory;
    price: string;
    images: string[];
    image?: string;
    featured?: boolean;
    measurements?: string;
}