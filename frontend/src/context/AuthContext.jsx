import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const userData = await apiService.getCurrentUser(storedToken);
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiService.login(email, password);
            const { access_token, user: userData } = response;
            
            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(userData);
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await apiService.register(username, email, password);
            // Don't auto-login - just return success with message
            return { 
                success: true, 
                message: response.message || 'Account created successfully! Please sign in.'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            // Call backend logout endpoint
            await apiService.logout();
        } catch (error) {
            // Continue with local cleanup even if backend call fails
            console.error('Backend logout error:', error);
        } finally {
            // Always clear local state
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
