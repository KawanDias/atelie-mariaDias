import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (productId: string) => void;
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

    const toggleFavorite = (productId: string) => {
        setFavorites((prev) => {
            const updated = prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId];
            localStorage.setItem('atelie_favorites', JSON.stringify(updated));
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
