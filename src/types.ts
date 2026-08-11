export type ProductCategory = 'Enxoval de Bebê' | 'Batizado' | 'Acessórios & Maternidade' | 'Decoração do Quartinho';

export interface Product {
    id: number;
    title: string;
    description: string;
    category: ProductCategory;
    price: string;
    image: string;
    featured?: boolean;
}
