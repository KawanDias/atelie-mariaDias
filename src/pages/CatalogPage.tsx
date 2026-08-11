import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import type { Product } from '../types';

function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlBusca = searchParams.get('busca') || '';

    const [searchTerm, setSearchTerm] = useState(urlBusca);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent'>('recent');

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    useEffect(() => {
        setSearchTerm(urlBusca);
    }, [urlBusca]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            setSearchParams({ busca: value });
        } else {
            setSearchParams({});
        }
    };

    const filteredProducts = useMemo(() => {
        let filtered: Product[] = products;

        if (urlBusca) {
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(urlBusca.toLowerCase()) ||
                    p.description.toLowerCase().includes(urlBusca.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        const sorted = [...filtered];
        if (sortBy === 'price-asc') {
            sorted.sort((a, b) => parseFloat(a.price.replace('R$ ', '').replace(',', '.')) - parseFloat(b.price.replace('R$ ', '').replace(',', '.')));
        } else if (sortBy === 'price-desc') {
            sorted.sort((a, b) => parseFloat(b.price.replace('R$ ', '').replace(',', '.')) - parseFloat(a.price.replace('R$ ', '').replace(',', '.')));
        }

        return sorted;
    }, [products, urlBusca, selectedCategory, sortBy]);

    const categories = ['Enxoval de Bebê', 'Batizado', 'Toalhas Personalizadas', 'Acessórios & Maternidade', 'Decoração do Quartinho'];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem', color: '#b58b8b' }}>Carregando catálogo...</div>;
    }

    return (
        <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', color: '#5e4e4e', fontWeight: 400, marginBottom: '0.4rem' }}>
                    {urlBusca ? `Resultados para "${urlBusca}"` : 'Nosso Catálogo'}
                </h2>
                <p style={{ color: '#8c7373', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Peças bordadas à mão, personalizadas para trazer amor e elegância ao quartinho do seu filho.
                </p>
            </div>

            {/* Barra de Filtros e Busca Compacta */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem', 
                background: '#ffffff', 
                padding: '1rem 1.5rem', 
                borderRadius: '20px', 
                border: '1px solid #f2e6e6',
                boxShadow: '0 4px 20px rgba(230, 200, 200, 0.12)',
                marginBottom: '1.5rem' 
            }}>
                {/* Pílulas de Categoria */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{ 
                            padding: '0.4rem 0.9rem', 
                            fontSize: '0.82rem', 
                            borderRadius: '20px',
                            border: '1px solid #e8dada',
                            cursor: 'pointer',
                            background: !selectedCategory ? '#b58b8b' : '#faf6f6', 
                            color: !selectedCategory ? '#fff' : '#7a6666',
                            fontWeight: !selectedCategory ? 600 : 400
                        }}
                    >
                        ✨ Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ 
                                padding: '0.4rem 0.9rem', 
                                fontSize: '0.82rem', 
                                borderRadius: '20px',
                                border: '1px solid #e8dada',
                                cursor: 'pointer',
                                background: selectedCategory === cat ? '#b58b8b' : '#faf6f6', 
                                color: selectedCategory === cat ? '#fff' : '#7a6666',
                                fontWeight: selectedCategory === cat ? 600 : 400
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Campo de Busca Delicado e Mais Baixo */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: '#faf6f6', 
                    border: '1px solid #e8dada', 
                    borderRadius: '20px', 
                    padding: '0.3rem 0.8rem', 
                    minWidth: '220px',
                    height: '34px' 
                }}>
                    <span style={{ marginRight: '0.4rem', fontSize: '0.8rem' }}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar peça..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            boxShadow: 'none',
                            fontSize: '0.82rem',
                            color: '#7a6666',
                            width: '100%'
                        }}
                    />
                </div>

                {/* Seletor de Ordenação */}
                <div>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{
                            background: '#faf6f6',
                            border: '1px solid #e8dada',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '12px',
                            fontSize: '0.82rem',
                            color: '#7a6666',
                            outline: 'none',
                            cursor: 'pointer',
                            height: '34px'
                        }}
                    >
                        <option value="recent">Mais Recentes</option>
                        <option value="price-asc">Menor Preço</option>
                        <option value="price-desc">Maior Preço</option>
                    </select>
                </div>
            </div>

            <div style={{ paddingLeft: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ color: '#a38f8f', fontSize: '0.85rem' }}>
                    {filteredProducts.length} produto(s) encontrado(s)
                </span>
            </div>

            <div className="grid products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#a38f8f' }}>
                        <p style={{ fontSize: '1.1rem' }}>Nenhum produto encontrado com esses critérios.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CatalogPage;