import React from 'react';
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

    // Função de formatação para garantir o "R$" sem duplicar
    const formatPrice = (price: string | number) => {
        if (!price) return 'R$ 0,00';
        const priceStr = String(price).trim();
        
        if (priceStr.startsWith('R$')) {
            return priceStr;
        }
        return `R$ ${priceStr}`;
    };

    return (
        <article style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #E8D5D5',
            boxShadow: '0 4px 16px rgba(80, 50, 50, 0.05)',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            padding: '1rem'
        }}>
            {/* Imagem do Produto */}
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', background: '#FFF5F5' }}>
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
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #E8D5D5',
                        borderRadius: '50%',
                        width: '2.2rem',
                        height: '2.2rem',
                        fontSize: '1.05rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 2px 6px rgba(80, 50, 50, 0.1)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    {isLiked ? '❤️' : '🤍'}
                </button>
            </div>

            {/* Metadados (Categoria e Tag) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.9rem', fontSize: '0.78rem', color: '#4A3C3C', fontWeight: 500 }}>
                <span>{product.category}</span>
                <span style={{ background: '#FFF5F5', padding: '0.2rem 0.6rem', borderRadius: '10px', border: '1px solid #E8D5D5', color: '#A65B5B', fontWeight: 600 }}>
                    Personalizável
                </span>
            </div>

            {/* Título */}
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2A1B1B', margin: '0.5rem 0 0.3rem 0', lineHeight: '1.3' }}>
                {product.title}
            </h3>

            {/* Descrição */}
            <p style={{ flexGrow: 1, fontSize: '0.85rem', color: '#4A3C3C', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                {product.description}
            </p>
            
            {/* Preço e Botões de Ação */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #F0E2E2', paddingTop: '0.8rem' }}>
                {/* Preço formatado com prefixo R$ automático */}
                <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#A65B5B', marginBottom: '0.7rem' }}>
                    {formatPrice(product.price)}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link 
                        to={`/produto/${product.id}`} 
                        style={{ 
                            flex: 1, 
                            textAlign: 'center',
                            background: '#FFF5F5',
                            color: '#4A3C3C',
                            border: '1px solid #E8D5D5',
                            padding: '0.55rem',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
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
                            background: '#A65B5B',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.55rem',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(166, 91, 91, 0.2)',
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