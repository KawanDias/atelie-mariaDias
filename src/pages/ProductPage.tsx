import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { useFavorites } from '../contexts/FavoritesContext';
import { openWhatsApp } from '../services/whatsappService';
import type { Product } from '../types';

function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {
        const products = getProducts();
        const found = products.find((p) => p.id.toString() === id);
        if (found) {
            setProduct(found);
        } else {
            navigate('/catalogo');
        }
    }, [id, navigate]);

    if (!product) {
        return (
            <section className="container">
                <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Carregando...</p>
                </div>
            </section>
        );
    }

    const isLiked = isFavorite(product.id.toString());

    return (
        <section className="container">
            <div className="about">
                <div className="panel" style={{ position: 'relative' }}>
                    <div className="product-image" style={{ height: '320px' }}>{product.image}</div>
                    <button
                        onClick={() => toggleFavorite(product.id.toString())}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '2.5rem',
                            height: '2.5rem',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        {isLiked ? '❤️' : '🤍'}
                    </button>
                </div>
                <div className="panel">
                    <p style={{ color: 'var(--primary)', fontWeight: 700 }}>📦 {product.category}</p>
                    <h2>{product.title}</h2>
                    <p style={{ fontSize: '1.05rem', color: '#7d6f6c', lineHeight: 1.6 }}>{product.description}</p>
                    <p className="price" style={{ fontSize: '1.4rem', marginTop: '1rem' }}>{product.price}</p>
                    <p style={{ color: '#a89a97', fontSize: '0.95rem', marginTop: '1rem' }}>
                        ✨ Prazo de confecção artesanal: 7 a 10 dias úteis
                    </p>
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                        <button
                            className="btn secondary"
                            onClick={() => window.history.back()}
                            style={{ flex: 1 }}
                        >
                            Voltar
                        </button>
                        <button
                            className="btn"
                            onClick={() => openWhatsApp(product)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                        >
                            📱 Solicitar Orçamento
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductPage;
