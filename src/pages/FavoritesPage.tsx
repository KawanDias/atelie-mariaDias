import { useFavorites } from '../contexts/FavoritesContext';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import type { Product } from '../types';

function FavoritesPage() {
    const { favorites } = useFavorites();
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

    useEffect(() => {
        const allProducts = getProducts();
        const favorited = allProducts.filter((p) => favorites.includes(p.id.toString()));
        setFavoriteProducts(favorited);
    }, [favorites]);

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
