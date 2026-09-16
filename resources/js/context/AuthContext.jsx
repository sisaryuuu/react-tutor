import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function refreshUser() {
        return fetch('/api/user', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then((r) => (r.ok ? r.json() : null))
            .then(setUser)
            .catch(() => setUser(null));
    }

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}