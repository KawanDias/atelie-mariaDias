import { useFavorites } from '../contexts/FavoritesContext';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import type { Product } from '../types';

function FavoritesPage() {
    const { favorites } = useFavorites();
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFavorites() {
            try {
                const allProducts = await getProducts();
                const favorited = allProducts.filter((p) => favorites.includes(p.id.toString()));
                setFavoriteProducts(favorited);
            } catch (error) {
                console.error("Erro ao carregar favoritos:", error);
            } finally {
                setLoading(false);
            }
        }
        loadFavorites();
    }, [favorites]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem', color: '#b58b8b' }}>Carregando favoritos...</div>;
    }

    return (
        <section className="container">
            <div className="section-title">
                <h2>Meus Favoritos ❤️</h2>
            </div>

            {favoriteProducts.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ fontSize: '1.2rem', color: '#a89a97', marginBottom: '1rem' }}>
                        Você ainda não salvou nenhuma peça nos favoritos.
                    </p>
                    <a href="/catalogo" className="btn">Continuar comprando</a>
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