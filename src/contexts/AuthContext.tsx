import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from 'firebase/auth';
import { auth } from '../services/firebase';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'client' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const ADMIN_EMAIL = 'mariagbdias@gmail.com';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const isAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || (isAdmin ? 'Administradora' : 'Usuário'),
                    role: isAdmin ? 'admin' : 'client',
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error("ERRO LOGIN FIREBASE:", error.code, error.message);
            throw new Error(error.message);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            throw new Error('Este e-mail é reservado para a administração.');
        }

        try {
            console.log("Tentando criar usuário no Firebase...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            await updateProfile(userCredential.user, { displayName: name });

            setUser({
                id: userCredential.user.uid,
                email: email,
                name: name,
                role: 'client'
            });
            console.log("Usuário criado com sucesso!");
        } catch (error: any) {
            // MOSTRA O ERRO REAL BRUTO NO CONSOLE
            console.error("ERRO COMPLETO DO FIREBASE (CODE):", error.code);
            console.error("ERRO COMPLETO DO FIREBASE (MESSAGE):", error.message);
            throw new Error(`Firebase [${error.code}]: ${error.message}`);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
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