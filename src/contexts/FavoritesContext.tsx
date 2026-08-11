import React, { createContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (productId: string, productTitle?: string) => void;
    isFavorite: (productId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('atelie_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const toggleFavorite = (productId: string, productTitle?: string) => {
        setFavorites((prev) => {
            const exists = prev.includes(productId);
            const updated = exists
                ? prev.filter((id) => id !== productId)
                : [...prev, productId];

            localStorage.setItem('atelie_favorites', JSON.stringify(updated));

            // Dispara o toast dependendo se foi adicionado ou removido
            const name = productTitle ? `"${productTitle}"` : 'O produto';
            if (exists) {
                toast.success(`${name} foi removido dos favoritos.`);
            } else {
                toast.success(`${name} foi adicionado aos favoritos!`);
            }

            return updated;
        });
    };

    const isFavorite = (productId: string): boolean => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = React.useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
    }
    return context;
};