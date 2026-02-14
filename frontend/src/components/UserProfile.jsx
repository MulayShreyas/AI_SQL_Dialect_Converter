import { useState, useRef, useEffect } from 'react';
import { FiUser, FiClock, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile({ onShowHistory }) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
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
                        <button
                            className="logout-button"
                            type="button"
                            disabled={isLoggingOut}
                            onClick={handleLogoutClick}
                        >
                            <FiLogOut />
                            <span>
                                {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;

