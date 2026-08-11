import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'client' | 'admin';
    password?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, role: 'client' | 'admin') => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('atelie_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
            } catch {
                localStorage.removeItem('atelie_user');
            }
        }
        setIsLoading(false);
    }, []);

    const getUsers = (): User[] => {
        const saved = localStorage.getItem('atelie_users');
        return saved ? JSON.parse(saved) : [];
    };

    const saveUsers = (users: User[]) => {
        localStorage.setItem('atelie_users', JSON.stringify(users));
    };

    const login = async (email: string, password: string) => {
        const users = getUsers();
        const foundUser = users.find((u) => u.email === email);

        if (!foundUser || foundUser.password !== password) {
            throw new Error('Email ou senha inválidos');
        }

        const userToSet: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
        };

        setUser(userToSet);
        localStorage.setItem('atelie_user', JSON.stringify(userToSet));
    };

    const signup = async (name: string, email: string, password: string, role: 'client' | 'admin' = 'client') => {
        const users = getUsers();

        // Check if email already exists
        if (users.some((u) => u.email === email)) {
            throw new Error('Este email já está cadastrado');
        }

        const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            password,
            role,
        };

        users.push(newUser);
        saveUsers(users);

        const userToSet: User = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
        };

        setUser(userToSet);
        localStorage.setItem('atelie_user', JSON.stringify(userToSet));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('atelie_user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
