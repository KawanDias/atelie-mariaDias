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
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Credenciais fixas da Administração
const ADMIN_EMAIL = 'mariagbdias@gmail.com';
const ADMIN_PASSWORD = 'Tn0adgll'; // Altere para a senha que desejar

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Carrega o usuário do localStorage ao iniciar
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
        // 1. Autenticação direta do Administrador via credenciais fixas
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            if (password !== ADMIN_PASSWORD) {
                throw new Error('Email ou senha inválidos');
            }

            const adminUser: User = {
                id: 'admin-master',
                email: ADMIN_EMAIL,
                name: 'Administradora',
                role: 'admin',
            };

            setUser(adminUser);
            localStorage.setItem('atelie_user', JSON.stringify(adminUser));
            return;
        }

        // 2. Autenticação de clientes comuns no localStorage
        const users = getUsers();
        const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (!foundUser || foundUser.password !== password) {
            throw new Error('Email ou senha inválidos');
        }

        const userToSet: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: 'client',
        };

        setUser(userToSet);
        localStorage.setItem('atelie_user', JSON.stringify(userToSet));
    };

    const signup = async (name: string, email: string, password: string) => {
        // Bloqueia tentativas de cadastrar a conta de administrador via formulário público
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            throw new Error('Este e-mail é reservado para a administração.');
        }

        const users = getUsers();

        // Verifica se o e-mail já existe
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Este email já está cadastrado');
        }

        // Todo novo cadastro público é criado estritamente como 'client'
        const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            password,
            role: 'client',
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