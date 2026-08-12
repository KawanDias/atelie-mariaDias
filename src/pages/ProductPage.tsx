import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Product } from '../types';

export function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const products = await getProducts();
                // Comparação segura convertendo ambos os IDs para String
                const found = products.find((p) => String(p.id) === String(id));
                setProduct(found || null);
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#b58b8b' }}>Carregando produto...</div>;
    }

    if (!product) {
        return (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>Produto não encontrado!</h2>
                <Link to="/catalogo" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>
                    Voltar ao Catálogo
                </Link>
            </div>
        );
    }

    const productIdStr = String(product.id);
    const fav = isFavorite(productIdStr);

    // Compatibilidade com array de imagens ou imagem única antiga
    const images: string[] = (product as any).images 
        ? (product as any).images 
        : ((product as any).image ? [(product as any).image] : []);

    const nextImage = () => {
        if (images.length === 0) return;
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        if (images.length === 0) return;
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const mainImg = images[currentImageIndex] || '';
    const isUrl = mainImg.startsWith('http') || mainImg.startsWith('data:');

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/catalogo" style={{ textDecoration: 'none', color: '#888', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>
                ← Voltar para o Catálogo
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                
                {/* CARROSSEL DE FOTOS */}
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden', background: '#f8f8f8', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isUrl ? (
                            <img 
                                src={mainImg} 
                                alt={product.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <span style={{ fontSize: '4rem' }}>{mainImg || '🖼️'}</span>
                        )}

                        {/* Botões do Carrossel (só se houver mais de 1 foto) */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    ❮
                                </button>
                                <button 
                                    onClick={nextImage}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    ❯
                                </button>
                            </>
                        )}
                    </div>

                    {/* Miniaturas na parte inferior */}
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', justifyContent: 'center' }}>
                            {images.map((img: string, idx: number) => {
                                const thumbIsUrl = img.startsWith('http') || img.startsWith('data:');
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        style={{
                                            width: '65px',
                                            height: '65px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            border: currentImageIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
                                            opacity: currentImageIndex === idx ? 1 : 0.6,
                                            transition: 'all 0.2s',
                                            background: '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {thumbIsUrl ? (
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '1.2rem' }}>{img}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Detalhes do Produto */}
                <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {product.category}
                    </span>
                    <h1 style={{ fontSize: '1.8rem', color: '#4a3b32', margin: '0.5rem 0' }}>{product.title}</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>{product.price}</p>

                    {/* Exibição das Medidas (caso exista) */}
                    {product.measurements && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            background: '#faf6f6', 
                            padding: '0.6rem 1rem', 
                            borderRadius: '10px', 
                            border: '1px solid #f2e6e6',
                            marginBottom: '1.2rem' 
                        }}>
                            <span style={{ fontSize: '1rem' }}>📏</span>
                            <span style={{ fontSize: '0.9rem', color: '#7a6666' }}>
                                <strong>Medidas:</strong> {product.measurements}
                            </span>
                        </div>
                    )}

                    <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#4a3b32' }}>Descrição do Produto</h3>
                        <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>{product.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a 
                            href={`https://wa.me/5542984230849?text=Olá!%20Gostaria%20de%20encomendar%20o%20produto:%20${encodeURIComponent(product.title)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                flex: 1,
                                background: '#b58b8b',
                                color: 'white',
                                textAlign: 'center',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            💬 Encomendar pelo WhatsApp
                        </a>

                        <button
                            onClick={() => toggleFavorite(productIdStr)}
                            style={{
                                background: fav ? '#ffebeb' : '#f5f5f5',
                                border: '1px solid #ddd',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}
                        >
                            {fav ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;