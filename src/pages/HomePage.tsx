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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
            {/* Seção Hero Full-Width */}
            <div style={{ 
                background: 'linear-gradient(135deg, #FFF5F5 0%, #F8ECE8 100%)', 
                padding: '3.5rem 3rem', 
                borderRadius: '24px', 
                border: '1px solid #E8D5D5',
                boxShadow: '0 12px 32px rgba(80, 50, 50, 0.08)',
                marginBottom: '3.5rem'
            }}>
                <div style={{ maxWidth: '780px' }}>
                    <p style={{ 
                        color: '#A65B5B', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.15em',
                        fontSize: '0.8rem',
                        marginBottom: '1rem'
                    }}>
                        Para a chegada especial
                    </p>

                    <h1 style={{ 
                        fontSize: '2.6rem', 
                        color: '#2A1B1B', 
                        fontWeight: 600, 
                        lineHeight: '1.2',
                        marginBottom: '1.2rem'
                    }}>
                        Enxoval de bebê bordado com carinho e exclusividade.
                    </h1>

                    <p style={{ 
                        color: '#4A3C3C', 
                        fontSize: '1.05rem', 
                        lineHeight: '1.65',
                        marginBottom: '2.2rem',
                        maxWidth: '680px'
                    }}>
                        Cada peça é confeccionada à mão com amor, trazendo personalidade e aconchego para o quartinho do seu filho. Lençóis, mantas, acessórios e decoração — tudo feito sob encomenda e pensado para durar.
                    </p>

                    <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link 
                            to="/catalogo" 
                            style={{ 
                                background: '#A65B5B', 
                                color: '#ffffff', 
                                padding: '0.9rem 2.2rem', 
                                borderRadius: '14px', 
                                fontWeight: 600, 
                                fontSize: '1rem',
                                textDecoration: 'none',
                                boxShadow: '0 6px 16px rgba(166, 91, 91, 0.25)',
                                transition: 'transform 0.2s, background 0.2s'
                            }}
                        >
                            Ver catálogo
                        </Link>

                        {/* Destaques rápidos ao lado do botão */}
                        <div style={{ display: 'flex', gap: '1.2rem', color: '#7A5A5A', fontSize: '0.88rem', fontWeight: 500 }}>                         
                            <span>✦ Envio para todo o Brasil</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção Mais Vendidos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', color: '#2A1B1B', fontWeight: 600 }}>
                    Mais vendidos
                </h2>
                <Link to="/catalogo" style={{ fontSize: '0.9rem', color: '#A65B5B', fontWeight: 700, textDecoration: 'none' }}>
                    Ver tudo →
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                {featuredProducts.length > 0 ? (
                    featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p style={{ color: '#7A6B6B' }}>Nenhum destaque no momento.</p>
                )}
            </div>

            {/* Seção Inferior: Quem Somos & Fale Conosco */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Cartão Quem Somos */}
                <div style={{ 
                    background: '#FFFFFF', 
                    padding: '2.2rem', 
                    borderRadius: '20px', 
                    border: '1px solid #E8D5D5', 
                    boxShadow: '0 8px 20px rgba(60, 40, 40, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h2 style={{ fontSize: '1.35rem', color: '#2A1B1B', fontWeight: 600, marginBottom: '0.8rem' }}>Quem somos</h2>
                    <p style={{ color: '#4A3C3C', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                        O Ateliê Maria Dias dedica-se a criar enxovais de bebê únicos e especiais. Cada ponto é bordado à mão por quem entende que a chegada de um filho merece o melhor.
                    </p>
                </div>

                {/* Cartão Fale Conosco */}
                <div style={{ 
                    background: '#FFFFFF', 
                    padding: '2.2rem', 
                    borderRadius: '20px', 
                    border: '1px solid #E8D5D5', 
                    boxShadow: '0 8px 20px rgba(60, 40, 40, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h3 style={{ fontSize: '1.35rem', color: '#2A1B1B', fontWeight: 600, marginBottom: '1.2rem' }}>Fale conosco</h3>
                    
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
                                background: '#FFF5F5',
                                border: '1px solid #E8D5D5',
                                borderRadius: '12px',
                                color: '#2A1B1B',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.92rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#A65B5B';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E8D5D5';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A65B5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                background: '#FFF5F5',
                                border: '1px solid #E8D5D5',
                                borderRadius: '12px',
                                color: '#2A1B1B',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.92rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#A65B5B';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E8D5D5';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A65B5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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