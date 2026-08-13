import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

export function FavoritesPage() {
    const { favorites } = useFavorites();
    const { user } = useAuth();
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Identifica o ID do usuário logado
    const userId = user ? ((user as any).uid || (user as any).id) as string : null;

    useEffect(() => {
        async function loadFavorites() {
            if (!userId) {
                setFavoriteProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const allProducts = await getProducts();
                // Filtra convertendo os IDs de forma segura para String
                const favorited = allProducts.filter((p) => favorites.includes(String(p.id)));
                setFavoriteProducts(favorited);
            } catch (error) {
                console.error("Erro ao carregar favoritos:", error);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, [favorites, userId]);

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
                    ❤️ Carregando sua lista de favoritos...
                </div>
            </div>
        );
    }

    return (
        <section style={{ padding: '2.5rem 1.25rem 4rem 1.25rem', maxWidth: '1100px', margin: '0 auto' }}>
            <style>{`
                .favorites-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    border-bottom: 2px solid #FAF2F2;
                    padding-bottom: 1rem;
                }

                .favorites-title {
                    font-size: 1.8rem;
                    color: #2D2323;
                    font-weight: 700;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .favorites-badge {
                    background: #FAF2F2;
                    color: #A35858;
                    border: 1px solid #F0E3E3;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .empty-card {
                    background: #FAF2F2;
                    border: 1px solid #F0E3E3;
                    border-radius: 20px;
                    padding: 3.5rem 1.5rem;
                    text-align: center;
                    max-width: 520px;
                    margin: 2rem auto;
                    box-shadow: 0 4px 20px rgba(163, 88, 88, 0.04);
                }

                .action-btn {
                    background: #A35858;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 0.8rem 1.6rem;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    display: inline-block;
                    box-shadow: 0 4px 12px rgba(163, 88, 88, 0.2);
                    transition: background 0.2s, transform 0.2s;
                }
                .action-btn:hover {
                    background: #8b4747;
                    transform: translateY(-2px);
                }

                .fav-products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1.8rem;
                }

                @media (max-width: 600px) {
                    .fav-products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 1rem;
                    }
                }
            `}</style>

            {/* CABEÇALHO */}
            <div className="favorites-header">
                <h1 className="favorites-title">
                    Meus Favoritos <span style={{ color: '#A35858' }}>❤️</span>
                </h1>
                {userId && (
                    <span className="favorites-badge">
                        {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item salvo' : 'itens salvos'}
                    </span>
                )}
            </div>

            {/* TELA 1: Usuário NÃO está logado */}
            {!userId && (
                <div className="empty-card">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                    <h3 style={{ color: '#2D2323', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Acesse sua conta
                    </h3>
                    <p style={{ color: '#625353', fontSize: '0.95rem', marginBottom: '1.8rem', lineHeight: '1.5' }}>
                        Você precisa estar conectado para visualizar seus itens salvos ou adicionar novos favoritos.
                    </p>
                    <Link to="/login" className="action-btn">
                        Fazer Login / Criar Conta
                    </Link>
                </div>
            )}

            {/* TELA 2: Usuário logado + Sem favoritos */}
            {userId && favoriteProducts.length === 0 && (
                <div className="empty-card">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪴</div>
                    <h3 style={{ color: '#2D2323', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Sua lista está vazia
                    </h3>
                    <p style={{ color: '#625353', fontSize: '0.95rem', marginBottom: '1.8rem', lineHeight: '1.5' }}>
                        Você ainda não salvou nenhuma peça artesanal. Explore o catálogo para encontrar seus modelos favoritos!
                    </p>
                    <Link to="/catalogo" className="action-btn">
                        Explorar Catálogo
                    </Link>
                </div>
            )}

            {/* TELA 3: Lista de Favoritos */}
            {userId && favoriteProducts.length > 0 && (
                <div className="fav-products-grid">
                    {favoriteProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default FavoritesPage;