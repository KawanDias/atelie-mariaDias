import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import hotToast from 'react-hot-toast'; // Opcional, se usar toast
import { productService } from '../services/productService'; // Certifique-se do caminho
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
                const products = await productService.getProducts();
                // Comparação segura convertendo ambos os IDs para String
                const found = products.find((p) => String(p.id) === String(id));
                setProduct(found || null);
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
                hotToast.error("Erro ao carregar os detalhes do produto.");
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '5rem 1rem', textAlign: 'center', color: '#625353', fontSize: '1.1rem' }}>
                <style>{`
                    @keyframes pulse {
                        0% { opacity: 0.5; }
                        50% { opacity: 1; }
                        100% { opacity: 0.5; }
                    }
                `}</style>
                <div style={{ animation: 'pulse 1.5s infinite ease-in-out', fontWeight: 500 }}>
                    🌸 Carregando detalhes do produto...
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: '5rem 1.25rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h2 style={{ color: '#2D2323', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Produto não encontrado!
                </h2>
                <p style={{ color: '#625353', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    A peça que você procura pode ter sido removida ou o link está incorreto.
                </p>
                <Link 
                    to="/catalogo" 
                    style={{ 
                        color: '#ffffff', 
                        background: '#A35858', 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '12px', 
                        textDecoration: 'none', 
                        fontWeight: 600,
                        display: 'inline-block',
                        boxShadow: '0 4px 12px rgba(163, 88, 88, 0.2)'
                    }}
                >
                    ← Voltar ao Catálogo
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

    // FORMATAÇÃO DO PREÇO CORRIGIDA
    const formattedPrice = typeof product.price === 'number'
        ? `R$ ${(product.price as number).toFixed(2).replace('.', ',')}` // Correção com 'as number'
        : String(product.price).includes('R$') 
            ? product.price 
            : `R$ ${product.price}`;

    return (
        <div style={{ padding: '2.5rem 1.25rem 4rem 1.25rem', maxWidth: '1020px', margin: '0 auto' }}>
            <style>{`
                .back-link {
                    text-decoration: none;
                    color: #625353;
                    font-size: 0.92rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    margin-bottom: 2rem;
                    font-weight: 500;
                    transition: color 0.2s, transform 0.2s;
                }
                .back-link:hover {
                    color: #A35858;
                    transform: translateX(-3px);
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 1fr;
                    gap: 2.5rem;
                    align-items: start;
                }

                .main-image-card {
                    position: relative;
                    width: 100%;
                    height: 420px;
                    border-radius: 24px;
                    overflow: hidden;
                    background: #FAF2F2;
                    border: 1px solid #F0E3E3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 25px rgba(163, 88, 88, 0.05);
                }

                .nav-arrow-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid #F0E3E3;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #2D2323;
                    font-size: 1rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: background 0.2s, transform 0.2s;
                    z-index: 2;
                }
                .nav-arrow-btn:hover {
                    background: #ffffff;
                    transform: translateY(-50%) scale(1.08);
                }

                .thumbnail-btn {
                    width: 70px;
                    height: 70px;
                    border-radius: 12px;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.2s;
                    background: #FAF2F2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }

                .whatsapp-btn {
                    flex: 1;
                    background: #25D366;
                    color: #ffffff;
                    text-align: center;
                    padding: 0.9rem 1.2rem;
                    border-radius: 14px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.98rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.22);
                    transition: background 0.2s, transform 0.2s;
                }
                .whatsapp-btn:hover {
                    background: #20ba5a;
                    transform: translateY(-2px);
                }

                .fav-btn {
                    border: 1px solid #F0E3E3;
                    padding: 0.9rem 1.1rem;
                    border-radius: 14px;
                    cursor: pointer;
                    font-size: 1.3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s, transform 0.2s, border-color 0.2s;
                }
                .fav-btn:hover {
                    transform: scale(1.05);
                }

                @media (max-width: 768px) {
                    .product-grid {
                        grid-template-columns: 1fr;
                        gap: 1.8rem;
                    }
                    .main-image-card {
                        height: 340px;
                    }
                }
            `}</style>

            <Link to="/catalogo" className="back-link">
                ← Voltar para o Catálogo
            </Link>

            <div className="product-grid">
                {/* CARROSSEL DE FOTOS */}
                <div>
                    <div className="main-image-card">
                        {isUrl ? (
                            <img 
                                src={mainImg} 
                                alt={product.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <span style={{ fontSize: '4.5rem' }}>{mainImg || '🖼️'}</span>
                        )}

                        {/* Botões do Carrossel */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="nav-arrow-btn"
                                    style={{ left: '12px' }}
                                    aria-label="Imagem anterior"
                                >
                                    ❮
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="nav-arrow-btn"
                                    style={{ right: '12px' }}
                                    aria-label="Próxima imagem"
                                >
                                    ❯
                                </button>
                            </>
                        )}
                    </div>

                    {/* Miniaturas na parte inferior */}
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {images.map((img: string, idx: number) => {
                                const thumbIsUrl = img.startsWith('http') || img.startsWith('data:');
                                const isActive = currentImageIndex === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className="thumbnail-btn"
                                        style={{
                                            border: isActive ? '2px solid #A35858' : '1px solid #F0E3E3',
                                            opacity: isActive ? 1 : 0.6,
                                            transform: isActive ? 'scale(1.03)' : 'scale(1)',
                                        }}
                                    >
                                        {thumbIsUrl ? (
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '1.4rem' }}>{img}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* DETALHES DO PRODUTO */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ 
                        fontSize: '0.82rem', 
                        color: '#A35858', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.8px',
                        marginBottom: '0.4rem'
                    }}>
                        {product.category}
                    </span>

                    <h1 style={{ fontSize: '1.9rem', color: '#2D2323', margin: '0 0 0.6rem 0', fontWeight: 700, lineHeight: '1.2' }}>
                        {product.title}
                    </h1>

                    <p style={{ fontSize: '1.6rem', fontWeight: 700, color: '#A35858', margin: '0 0 1.2rem 0' }}>
                        {formattedPrice}
                    </p>

                    {/* Exibição das Medidas */}
                    {product.measurements && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.6rem', 
                            background: '#FAF2F2', 
                            padding: '0.75rem 1rem', 
                            borderRadius: '14px', 
                            border: '1px solid #F0E3E3',
                            marginBottom: '1.2rem' 
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>📏</span>
                            <span style={{ fontSize: '0.9rem', color: '#625353' }}>
                                <strong style={{ color: '#2D2323' }}>Medidas:</strong> {product.measurements}
                            </span>
                        </div>
                    )}

                    {/* Card de Descrição */}
                    <div style={{ 
                        background: '#ffffff', 
                        padding: '1.25rem', 
                        borderRadius: '18px', 
                        border: '1px solid #F0E3E3', 
                        boxShadow: '0 4px 15px rgba(163, 88, 88, 0.03)',
                        marginBottom: '1.8rem' 
                    }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#2D2323', fontWeight: 600 }}>
                            Descrição da Peça
                        </h3>
                        <p style={{ color: '#625353', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                            {product.description}
                        </p>
                    </div>

                    {/* Botões de Ação */}
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
                        <a 
                            href={`https://wa.me/5542984230849?text=Olá!%20Gostaria%20de%20encomendar%20o%20produto:%20${encodeURIComponent(product.title)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="whatsapp-btn"
                        >
                            💬 Encomendar pelo WhatsApp
                        </a>

                        <button
                            onClick={() => toggleFavorite(productIdStr)}
                            className="fav-btn"
                            style={{
                                background: fav ? '#FDF2F2' : '#FAF2F2',
                                borderColor: fav ? '#F5C6C6' : '#F0E3E3',
                            }}
                            title={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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