import { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();

    // Form states
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await login(loginForm.email, loginForm.password);
        
        if (result.success) {
            toast.success('Welcome back!');
            onClose();
        } else {
            toast.error(result.error);
        }
        
        setIsLoading(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        if (registerForm.password !== registerForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (registerForm.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const result = await register(
            registerForm.username,
            registerForm.email,
            registerForm.password
        );
        
        if (result.success) {
            toast.success(result.message);
            // Switch to login tab so user can sign in
            setMode('login');
            // Pre-fill email if possible (optional, but nice UX)
            setLoginForm(prev => ({ ...prev, email: registerForm.email }));
        } else {
            toast.error(result.error);
        }
        
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={onClose}>
                    <FiX size={24} />
                </button>

                <div className="auth-modal-header">
                    <div className="auth-modal-logo">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="4" width="18" height="4" rx="1" fill="#48c6ef"/>
                            <rect x="3" y="10" width="18" height="4" rx="1" fill="#667eea"/>
                            <rect x="3" y="16" width="18" height="4" rx="1" fill="#f093fb"/>
                        </svg>
                    </div>
                    <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{mode === 'login' 
                        ? 'Sign in to save your conversions' 
                        : 'Join us to unlock all features'}</p>
                </div>

                <div className="auth-tabs">
                    <button 
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => setMode('login')}
                    >
                        Sign In
                    </button>
                    <button 
                        className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => setMode('register')}
                    >
                        Sign Up
                    </button>
                </div>

                {mode === 'login' ? (
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <div className="auth-input-group">
                            <FiMail className="auth-input-icon" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <FiLock className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                required
                            />
                            <button 
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="auth-loading">
                                    <span className="auth-spinner"></span>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleRegisterSubmit}>
                        <div className="auth-input-group">
                            <FiUser className="auth-input-icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={registerForm.username}
                                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <FiMail className="auth-input-icon" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <FiLock className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                                required
                            />
                            <button 
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        <div className="auth-input-group">
                            <FiLock className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={registerForm.confirmPassword}
                                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="auth-loading">
                                    <span className="auth-spinner"></span>
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AuthModal;
