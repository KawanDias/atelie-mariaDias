import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { openWhatsApp } from '../services/whatsappService';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isLiked = isFavorite(product.id.toString());

    const imageList = (product as any).images || ((product as any).image ? [(product as any).image] : []);
    const mainImage = imageList.length > 0 ? imageList[0] : '';
    const isUrl = mainImage.startsWith('http') || mainImage.startsWith('data:');

    return (
        <article style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #f2e6e6',
            boxShadow: '0 4px 16px rgba(230, 200, 200, 0.1)',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            padding: '1rem'
        }}>
            {/* Imagem do Produto */}
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', background: '#faf6f6' }}>
                <div style={{ width: '100%', height: '210px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isUrl ? (
                        <img 
                            src={mainImage} 
                            alt={product.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <span style={{ fontSize: '2.8rem' }}>{mainImage || '🖼️'}</span>
                    )}
                </div>

                {/* Botão de Favorito Delicado */}
                <button
                    onClick={() => toggleFavorite(product.id.toString())}
                    style={{
                        position: 'absolute',
                        top: '0.6rem',
                        right: '0.6rem',
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #f0e0e0',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    {isLiked ? '❤️' : '🤍'}
                </button>
            </div>

            {/* Metadados (Categoria e Tag) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.9rem', fontSize: '0.75rem', color: '#a38f8f' }}>
                <span>{product.category}</span>
                <span style={{ background: '#faf6f6', padding: '0.15rem 0.5rem', borderRadius: '10px', border: '1px solid #f2e6e6' }}>
                    {product.featured ? 'Exclusivo' : 'Personalizável'}
                </span>
            </div>

            {/* Título */}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#5e4e4e', margin: '0.4rem 0 0.3rem 0', lineHeight: '1.3' }}>
                {product.title}
            </h3>

            {/* Descrição */}
            <p style={{ flexGrow: 1, fontSize: '0.82rem', color: '#8c7373', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                {product.description}
            </p>
            
            {/* Preço e Botões de Ação */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #f9f2f2', paddingTop: '0.75rem' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#b58b8b', marginBottom: '0.6rem' }}>
                    {product.price}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link 
                        to={`/produto/${product.id}`} 
                        style={{ 
                            flex: 1, 
                            textAlign: 'center',
                            background: '#faf6f6',
                            color: '#8c7373',
                            border: '1px solid #e8dada',
                            padding: '0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            transition: 'background 0.2s'
                        }}
                    >
                        Ver peça
                    </Link>

                    <button
                        onClick={() => openWhatsApp(product)}
                        style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '0.3rem',
                            background: '#b58b8b',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        💬 Orçamento
                    </button>
                </div>
            </div>
        </article>
    );
}