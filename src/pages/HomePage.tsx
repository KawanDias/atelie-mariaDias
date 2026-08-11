import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import type { Product } from '../types'; // Importando o tipo Product

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
            {/* Seção Hero */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.2fr 0.8fr', 
                gap: '2rem', 
                alignItems: 'center',
                marginBottom: '3.5rem'
            }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #fff9f9 0%, #fef2f2 100%)', 
                    padding: '2.5rem', 
                    borderRadius: '24px', 
                    border: '1px solid #f2e6e6',
                    boxShadow: '0 10px 30px rgba(230, 200, 200, 0.15)' 
                }}>
                    <p style={{ 
                        color: '#b58b8b', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.15em',
                        fontSize: '0.75rem',
                        marginBottom: '0.8rem'
                    }}>
                        Para a chegada especial
                    </p>

                    <h1 style={{ 
                        fontSize: '2.3rem', 
                        color: '#5e4e4e', 
                        fontWeight: 400, 
                        lineHeight: '1.25',
                        marginBottom: '1rem'
                    }}>
                        Enxoval de bebê bordado com carinho e exclusividade.
                    </h1>

                    <p style={{ 
                        color: '#8c7373', 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6',
                        marginBottom: '2rem'
                    }}>
                        Cada peça é confeccionada à mão com amor, trazendo personalidade e aconchego para o quartinho do seu filho. Lençóis, mantas, acessórios e decoração — tudo feito sob encomenda e pensado para durar.
                    </p>

                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        <Link 
                            to="/catalogo" 
                            style={{ 
                                background: '#b58b8b', 
                                color: '#ffffff', 
                                padding: '0.7rem 1.5rem', 
                                borderRadius: '14px', 
                                fontWeight: 500, 
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(181, 139, 139, 0.25)',
                                transition: 'opacity 0.2s'
                            }}
                        >
                            Ver enxoval
                        </Link>
                        <Link 
                            to="/login" 
                            style={{ 
                                background: '#ffffff', 
                                color: '#7a6666', 
                                padding: '0.7rem 1.5rem', 
                                borderRadius: '14px', 
                                fontWeight: 500, 
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                border: '1px solid #e8dada',
                                transition: 'background 0.2s'
                            }}
                        >
                            Minha conta
                        </Link>
                    </div>
                </div>

                <div style={{ 
                    background: '#ffffff', 
                    padding: '2.2rem', 
                    borderRadius: '24px', 
                    border: '1px solid #f2e6e6',
                    boxShadow: '0 10px 30px rgba(230, 200, 200, 0.1)' 
                }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#5e4e4e', fontWeight: 500, marginBottom: '1.2rem' }}>
                        Por que escolher o Ateliê?
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem', color: '#8c7373', fontSize: '0.9rem' }}>
                        <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            <span style={{ color: '#b58b8b' }}>•</span>
                            <span>Bordados 100% feitos à mão com atenção artesanal</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            <span style={{ color: '#b58b8b' }}>•</span>
                            <span>Enxoval personalizado com seu gosto e estilo</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            <span style={{ color: '#b58b8b' }}>•</span>
                            <span>Matérias-primas de qualidade para a delicadeza do bebê</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            <span style={{ color: '#b58b8b' }}>•</span>
                            <span>Atendimento próximo e prazos acolhedores</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Seção Mais Vendidos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#5e4e4e', fontWeight: 400 }}>
                    Mais vendidos
                </h2>
                <Link to="/catalogo" style={{ fontSize: '0.85rem', color: '#b58b8b', fontWeight: 600, textDecoration: 'none' }}>
                    Ver tudo →
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
                {featuredProducts.length > 0 ? (
                    featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p style={{ color: '#a38f8f' }}>Nenhum destaque no momento.</p>
                )}
            </div>

            {/* Seção Quem Somos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #f2e6e6', boxShadow: '0 4px 16px rgba(230, 200, 200, 0.08)' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#5e4e4e', fontWeight: 500, marginBottom: '0.8rem' }}>Quem somos</h2>
                    <p style={{ color: '#8c7373', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        O Ateliê Maria Dias dedica-se a criar enxovais de bebê únicos e especiais. Cada ponto é bordado à mão por quem entende que a chegada de um filho merece o melhor.
                    </p>
                </div>
                <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #f2e6e6', boxShadow: '0 4px 16px rgba(230, 200, 200, 0.08)' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#5e4e4e', fontWeight: 500, marginBottom: '0.8rem' }}>Nossa especialidade</h3>
                    <p style={{ color: '#8c7373', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Enxoval sob encomenda com personalização. Desde lençóis e mantas bordados até bastidores porta-maternidade e acessórios.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;