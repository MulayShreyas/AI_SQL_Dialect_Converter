import { useState, useRef, useEffect } from 'react';
import { FiUser, FiClock, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile({ onShowHistory }) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Direct logout function
    const handleLogoutClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('=== SIGN OUT CLICKED ===');
        
        if (isLoggingOut) {
            console.log('Already logging out, ignoring...');
            return;
        }
        
        setIsLoggingOut(true);
        // Don't close dropdown yet - wait for logout to complete
        
        // Clear local storage immediately
        localStorage.removeItem('token');
        console.log('Token removed from localStorage');
        
        // Call logout and redirect
        logout().then(() => {
            console.log('Logout complete, redirecting...');
            window.location.href = '/';
        }).catch((err) => {
            console.error('Logout error:', err);
            // Still redirect even on error
            window.location.href = '/';
        });
    };

    const handleShowHistory = () => {
        if (onShowHistory) {
            onShowHistory();
        }
        setIsOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Dynamic styles based on hover state
    const logoutButtonStyle = {
        cursor: 'pointer',
        pointerEvents: 'auto',
        position: 'relative',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem 1rem',
        background: isHovering ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
        border: 'none',
        borderRadius: '10px',
        fontSize: '0.95rem',
        color: isHovering ? '#dc2626' : '#ef4444',
        textAlign: 'left',
        marginTop: '0.25rem',
        transition: 'all 0.2s ease'
    };

    return (
        <div className="user-profile" ref={dropdownRef}>
            <button
                className="user-profile-button"
                onClick={() => setIsOpen(prev => !prev)}
                type="button"
            >
                <div className="user-avatar">
                    {getInitials(user?.username)}
                </div>
                <span className="user-name">{user?.username}</span>
                <FiChevronDown
                    className={`dropdown-icon ${isOpen ? 'open' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="user-dropdown">
                    <div className="dropdown-header">
                        <div className="dropdown-avatar">
                            {getInitials(user?.username)}
                        </div>
                        <div className="dropdown-user-info">
                            <span className="dropdown-username">
                                {user?.username}
                            </span>
                            <span className="dropdown-email">
                                {user?.email}
                            </span>
                        </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-menu">
                        <button
                            className="dropdown-item"
                            type="button"
                            onClick={handleShowHistory}
                        >
                            <FiClock />
                            <span>Conversion History</span>
                        </button>

                        <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            <FiUser />
                            <span>Profile Settings</span>
                        </button>

                        <div className="dropdown-divider"></div>

                        {/* Sign Out Button */}
                        <div
                            role="button"
                            tabIndex={0}
                            style={logoutButtonStyle}
                            onClick={handleLogoutClick}
                            onMouseEnter={() => {
                                console.log('Mouse entered Sign Out button');
                                setIsHovering(true);
                            }}
                            onMouseLeave={() => {
                                console.log('Mouse left Sign Out button');
                                setIsHovering(false);
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogoutClick(e)}
                        >
                            <FiLogOut style={{ color: isHovering ? '#dc2626' : '#ef4444', pointerEvents: 'none' }} />
                            <span style={{ pointerEvents: 'none' }}>
                                {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;

