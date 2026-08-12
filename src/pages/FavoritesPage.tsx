import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

function FavoritesPage() {
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
        return <div style={{ textAlign: 'center', padding: '4rem', color: '#b58b8b' }}>Carregando favoritos...</div>;
    }

    // TELA 1: Usuário NÃO está logado
    if (!userId) {
        return (
            <section className="container">
                <div className="section-title">
                    <h2>Meus Favoritos ❤️</h2>
                </div>
                <div className="panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <p style={{ fontSize: '1.2rem', color: '#8c7373', marginBottom: '1.5rem' }}>
                        Você precisa estar conectado para visualizar ou salvar seus produtos favoritos.
                    </p>
                    <Link to="/login" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Fazer Login / Criar Conta
                    </Link>
                </div>
            </section>
        );
    }

    // TELA 2: Usuário está logado
    return (
        <section className="container">
            <div className="section-title">
                <h2>Meus Favoritos ❤️</h2>
            </div>

            {favoriteProducts.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <p style={{ fontSize: '1.2rem', color: '#a89a97', marginBottom: '1.5rem' }}>
                        Você ainda não salvou nenhuma peça nos favoritos.
                    </p>
                    <Link to="/catalogo" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Continuar Comprando
                    </Link>
                </div>
            ) : (
                <div className="grid products-grid">
                    {favoriteProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default FavoritesPage;