import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { favoriteService } from '../services/favoriteService';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (productId: string, productTitle?: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
    syncFavorites: (validIds: string[]) => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userId = user ? ((user as any).uid || (user as any).id) as string : null;

    useEffect(() => {
        async function loadFavorites() {
            setLoading(true);
            if (userId) {
                const firestoreFavs = await favoriteService.getUserFavorites(userId);
                setFavorites(firestoreFavs);
            } else {
                setFavorites([]);
                localStorage.removeItem('atelie_favorites');
            }
            setLoading(false);
        }

        loadFavorites();
    }, [userId]);

    const toggleFavorite = async (productId: string, productTitle?: string) => {
        if (!userId) {
            toast.error('Faça login ou crie uma conta para favoritar produtos!');
            navigate('/login');
            return;
        }

        const exists = favorites.includes(productId);
        const updated = exists
            ? favorites.filter((id) => id !== productId)
            : [...favorites, productId];

        setFavorites(updated);

        const name = productTitle ? `"${productTitle}"` : 'O produto';
        if (exists) {
            toast.success(`${name} foi removido dos favoritos.`);
            await favoriteService.removeFavorite(userId, productId);
        } else {
            toast.success(`${name} foi adicionado aos favoritos!`);
            await favoriteService.addFavorite(userId, productId);
        }
    };

    // Remove silenciosamente IDs de produtos que não existem mais no catálogo
    const syncFavorites = async (validIds: string[]) => {
        const staleIds = favorites.filter((id) => !validIds.includes(id));
        if (staleIds.length === 0) return;

        const updated = favorites.filter((id) => validIds.includes(id));
        setFavorites(updated);

        if (userId) {
            for (const staleId of staleIds) {
                await favoriteService.removeFavorite(userId, staleId);
            }
        }
    };

    const isFavorite = (productId: string): boolean => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, syncFavorites }}>
            {!loading ? (
                children
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#b58b8b' }}>
                    Carregando favoritos...
                </div>
            )}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
    }
    return context;
};