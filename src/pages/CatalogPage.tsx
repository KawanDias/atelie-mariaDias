import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { initializeDefaultProducts } from '../services/productService';
import { mockProducts } from '../data/products';

function CatalogPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent'>('recent');

    // Initialize default products if none exist
    useMemo(() => {
        initializeDefaultProducts(mockProducts);
    }, []);

    const products = getProducts();

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        // Sort
        const sorted = [...filtered];
        if (sortBy === 'price-asc') {
            sorted.sort((a, b) => parseFloat(a.price.replace('R$ ', '')) - parseFloat(b.price.replace('R$ ', '')));
        } else if (sortBy === 'price-desc') {
            sorted.sort((a, b) => parseFloat(b.price.replace('R$ ', '')) - parseFloat(a.price.replace('R$ ', '')));
        }

        return sorted;
    }, [products, searchTerm, selectedCategory, sortBy]);

    const categories = ['Enxoval de Bebê', 'Batizado', 'Acessórios & Maternidade', 'Decoração do Quartinho'];

    return (
        <section className="container">
            <div className="section-title">
                <div>
                    <h2>Enxoval de Bebê</h2>
                    <p style={{ color: '#7d766f', marginTop: '0.3rem' }}>Peças bordadas à mão, personalizadas para trazer amor e elegância ao quartinho do seu filho.</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(196, 139, 144, 0.08)' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Buscar</label>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>Categoria</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="btn ghost"
                            style={{ background: !selectedCategory ? 'var(--primary)' : 'var(--soft-pink)', color: !selectedCategory ? '#fff' : 'var(--text)' }}
                        >
                            Todas
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className="btn ghost"
                                style={{ background: selectedCategory === cat ? 'var(--primary)' : 'var(--soft-pink)', color: selectedCategory === cat ? '#fff' : 'var(--text)' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Ordenar por</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                        <option value="recent">Mais Recentes</option>
                        <option value="price-asc">Menor Preço</option>
                        <option value="price-desc">Maior Preço</option>
                    </select>
                </div>
            </div>

            <p style={{ color: '#a89a97', marginBottom: '1rem' }}>{filteredProducts.length} produto(s) encontrado(s)</p>

            <div className="grid products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#a89a97' }}>Nenhum produto encontrado.</p>
                )}
            </div>
        </section>
    );
}

export default CatalogPage;
