import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { favoriteService } from '../services/favoriteService';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (productId: string, productTitle?: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Obtém o ID do usuário logado de forma segura
    const userId = user ? ((user as any).uid || (user as any).id) as string : null;

    // Carrega favoritos do Firestore apenas se estiver logado
    useEffect(() => {
        async function loadFavorites() {
            setLoading(true);
            if (userId) {
                // Se está logado, busca os favoritos do Firebase
                const firestoreFavs = await favoriteService.getUserFavorites(userId);
                setFavorites(firestoreFavs);
            } else {
                // Se deslogou ou não está logado: ZERA a lista na hora!
                setFavorites([]);
                localStorage.removeItem('atelie_favorites');
            }
            setLoading(false);
        }

        loadFavorites();
    }, [userId]);

    const toggleFavorite = async (productId: string, productTitle?: string) => {
        // 🔒 REGRA 2: Se NÃO estiver logado, bloqueia e redireciona
        if (!userId) {
            toast.error('Faça login ou crie uma conta para favoritar produtos!');
            navigate('/login'); // Redireciona para a rota de login (ajuste a rota se no seu app for diferente, ex: '/entrar')
            return;
        }

        const exists = favorites.includes(productId);
        const updated = exists
            ? favorites.filter((id) => id !== productId)
            : [...favorites, productId];

        // Atualização instantânea da interface
        setFavorites(updated);

        // Feedback via Toast
        const name = productTitle ? `"${productTitle}"` : 'O produto';
        if (exists) {
            toast.success(`${name} foi removido dos favoritos.`);
        } else {
            toast.success(`${name} foi adicionado aos favoritos!`);
        }

        // Salva as alterações no Firestore
        if (exists) {
            await favoriteService.removeFavorite(userId, productId);
        } else {
            await favoriteService.addFavorite(userId, productId);
        }
    };

    const isFavorite = (productId: string): boolean => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
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