import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

function CatalogPage() {
    const [searchParams] = useSearchParams();
    const urlBusca = searchParams.get('busca') || '';

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent'>('recent');

    const products = getProducts();

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filtro por termo de busca (da URL ou do Header)
        if (urlBusca) {
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(urlBusca.toLowerCase()) ||
                    p.description.toLowerCase().includes(urlBusca.toLowerCase())
            );
        }

        // Filtro por categoria
        if (selectedCategory) {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        // Ordenação
        const sorted = [...filtered];
        if (sortBy === 'price-asc') {
            sorted.sort((a, b) => parseFloat(a.price.replace('R$ ', '').replace(',', '.')) - parseFloat(b.price.replace('R$ ', '').replace(',', '.')));
        } else if (sortBy === 'price-desc') {
            sorted.sort((a, b) => parseFloat(b.price.replace('R$ ', '').replace(',', '.')) - parseFloat(a.price.replace('R$ ', '').replace(',', '.')));
        }

        return sorted;
    }, [products, urlBusca, selectedCategory, sortBy]);

    const categories = ['Enxoval de Bebê', 'Batizado', 'Toalhas Personalizadas', 'Acessórios & Maternidade', 'Decoração do Quartinho'];

    return (
        <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Título da Seção */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', color: '#5e4e4e', fontWeight: 400, marginBottom: '0.4rem' }}>
                    {urlBusca ? `Resultados para "${urlBusca}"` : 'Nosso Catálogo'}
                </h2>
                <p style={{ color: '#8c7373', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Peças bordadas à mão, personalizadas para trazer amor e elegância ao quartinho do seu filho.
                </p>
            </div>

            {/* Barra de Filtros e Ordenação Compacta e Delicada */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem', 
                background: '#ffffff', 
                padding: '1.2rem 1.8rem', 
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
                            transition: 'all 0.2s',
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
                                transition: 'all 0.2s',
                                background: selectedCategory === cat ? '#b58b8b' : '#faf6f6', 
                                color: selectedCategory === cat ? '#fff' : '#7a6666',
                                fontWeight: selectedCategory === cat ? 600 : 400
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Seletor de Ordenação Discreto */}
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
                            cursor: 'pointer'
                        }}
                    >
                        <option value="recent">Mais Recentes</option>
                        <option value="price-asc">Menor Preço</option>
                        <option value="price-desc">Maior Preço</option>
                    </select>
                </div>
            </div>

            {/* Contador de produtos sutis */}
            <div style={{ paddingLeft: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ color: '#a38f8f', fontSize: '0.85rem' }}>
                    {filteredProducts.length} produto(s) encontrado(s)
                </span>
            </div>

            {/* Grade de Produtos */}
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