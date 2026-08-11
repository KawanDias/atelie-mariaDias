import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { openWhatsApp } from '../services/whatsappService';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isLiked = isFavorite(product.id.toString());

    return (
        <article className="product-card">
            <div style={{ position: 'relative' }}>
                <div className="product-image">{product.image}</div>
                <button
                    onClick={() => toggleFavorite(product.id.toString())}
                    style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        fontSize: '1.2rem',
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
            <div className="product-meta">
                <span>{product.category}</span>
                <span>{product.featured ? 'Exclusivo' : 'Personalizável'}</span>
            </div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p className="price">{product.price}</p>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
                <Link className="btn secondary" to={`/produto/${product.id}`} style={{ flex: 1, textAlign: 'center' }}>
                    Ver peça
                </Link>
                <button
                    className="btn"
                    onClick={() => openWhatsApp(product)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                    📱 Orçamento
                </button>
            </div>
        </article>
    );
}

export default ProductCard;
