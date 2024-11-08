// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/app/pocketbase';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

    useEffect(() => {
        const unsubscribe = pb.authStore.onChange(() => {
            setIsAuthenticated(pb.authStore.isValid);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};