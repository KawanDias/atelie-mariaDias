import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import type { Product } from '../types';

function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function loadData() {
            const allProducts = await getProducts();
            const filtered = allProducts.filter((product) => product.featured);
            setFeaturedProducts(filtered);
        }
        loadData();
    }, []);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem 4rem 1.25rem' }}>
            {/* CSS Responsivo da Landing Page */}
            <style>{`
                .hero-card {
                    background: linear-gradient(135deg, #FFF9F9 0%, #FAF2F2 100%);
                    padding: 3.5rem 3rem;
                    border-radius: 24px;
                    border: 1px solid #F0E3E3;
                    box-shadow: 0 12px 32px rgba(163, 88, 88, 0.06);
                    margin-bottom: 3.5rem;
                }

                .hero-title {
                    font-size: 2.5rem;
                    color: #2D2323;
                    font-weight: 700;
                    line-height: 1.25;
                    margin-bottom: 1.2rem;
                }

                .hero-subtitle {
                    color: #625353;
                    font-size: 1.05rem;
                    line-height: 1.65;
                    margin-bottom: 2.2rem;
                    max-width: 680px;
                }

                .hero-actions {
                    display: flex;
                    gap: 1.8rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .cta-button {
                    background: #A35858;
                    color: #ffffff;
                    padding: 0.9rem 2.2rem;
                    border-radius: 14px;
                    font-weight: 600;
                    font-size: 1rem;
                    text-decoration: none;
                    box-shadow: 0 6px 18px rgba(163, 88, 88, 0.25);
                    transition: transform 0.2s ease, background 0.2s ease;
                    display: inline-block;
                    text-align: center;
                }

                .cta-button:hover {
                    transform: translateY(-2px);
                    background: #8e4b4b;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 1.5rem;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                }

                .info-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .info-card {
                    background: #FFFFFF;
                    padding: 2.2rem;
                    border-radius: 20px;
                    border: 1px solid #F0E3E3;
                    box-shadow: 0 8px 20px rgba(163, 88, 88, 0.04);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                /* Breakpoint Mobile */
                @media (max-width: 768px) {
                    .hero-card {
                        padding: 2rem 1.5rem;
                        border-radius: 20px;
                        margin-bottom: 2.5rem;
                    }

                    .hero-title {
                        font-size: 1.75rem;
                        margin-bottom: 0.8rem;
                    }

                    .hero-subtitle {
                        font-size: 0.95rem;
                        margin-bottom: 1.5rem;
                    }

                    .hero-actions {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }

                    .cta-button {
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .section-header {
                        align-items: center;
                    }

                    .info-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>

            {/* Seção Hero */}
            <div className="hero-card">
                <div style={{ maxWidth: '780px' }}>
                    <p style={{ 
                        color: '#A35858', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.15em',
                        fontSize: '0.8rem',
                        marginBottom: '0.8rem'
                    }}>
                        Para a chegada especial
                    </p>

                    <h1 className="hero-title">
                        Enxoval de bebê bordado com carinho e exclusividade.
                    </h1>

                    <p className="hero-subtitle">
                        Cada peça é confeccionada à mão com amor, trazendo personalidade e aconchego para o quartinho do seu filho. Lençóis, mantas, acessórios e decoração — tudo feito sob encomenda e pensado para durar.
                    </p>

                    <div className="hero-actions">
                        <Link to="/catalogo" className="cta-button">
                            Ver catálogo
                        </Link>

                        {/* Destaque rápido */}
                        <div style={{ display: 'flex', gap: '0.5rem', color: '#625353', fontSize: '0.88rem', fontWeight: 500, alignItems: 'center' }}>
                            <span style={{ color: '#A35858' }}>✦</span>
                            <span>Envio para todo o Brasil</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção Mais Vendidos */}
            <div className="section-header">
                <h2 style={{ fontSize: '1.75rem', color: '#2D2323', fontWeight: 700, margin: 0 }}>
                    Mais vendidos
                </h2>
                <Link to="/catalogo" style={{ fontSize: '0.9rem', color: '#A35858', fontWeight: 700, textDecoration: 'none' }}>
                    Ver tudo →
                </Link>
            </div>

            <div className="product-grid">
                {featuredProducts.length > 0 ? (
                    featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p style={{ color: '#625353' }}>Nenhum destaque no momento.</p>
                )}
            </div>

            {/* Seção Inferior: Quem Somos & Fale Conosco */}
            <div className="info-cards-grid">
                {/* Cartão Quem Somos */}
                <div className="info-card">
                    <h2 style={{ fontSize: '1.35rem', color: '#2D2323', fontWeight: 700, marginBottom: '0.8rem' }}>
                        Quem somos
                    </h2>
                    <p style={{ color: '#625353', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                        O Ateliê Maria Dias dedica-se a criar enxovais de bebê únicos e especiais. Cada ponto é bordado à mão por quem entende que a chegada de um filho merece o melhor.
                    </p>
                </div>

                {/* Cartão Fale Conosco */}
                <div className="info-card">
                    <h3 style={{ fontSize: '1.35rem', color: '#2D2323', fontWeight: 700, marginBottom: '1.2rem' }}>
                        Fale conosco
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {/* Link Instagram */}
                        <a 
                            href="https://instagram.com/atelie.mariadias/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                padding: '0.75rem 1rem',
                                background: '#FAF2F2',
                                border: '1px solid #F0E3E3',
                                borderRadius: '12px',
                                color: '#2D2323',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.92rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#A35858';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#F0E3E3';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A35858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            <span>atelie.mariadias</span>
                        </a>

                        {/* Link Facebook */}
                        <a 
                            href="https://facebook.com/maria.dias.102865" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                padding: '0.75rem 1rem',
                                background: '#FAF2F2',
                                border: '1px solid #F0E3E3',
                                borderRadius: '12px',
                                color: '#2D2323',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.92rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#A35858';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#F0E3E3';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A35858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                            <span>Maria Dias</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;