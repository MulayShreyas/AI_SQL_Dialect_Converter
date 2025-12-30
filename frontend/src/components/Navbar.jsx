import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
    const [activeLink, setActiveLink] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { id: 'home', label: 'Home', href: '#home' },
        { id: 'about', label: 'About', href: '#about' },
        { id: 'features', label: 'Features', href: '#features' },
        { id: 'pricing', label: 'Pricing', href: '#pricing' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-wrapper">
                {/* Left Container - Logo */}
                <div className="navbar-logo-container">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="4" width="18" height="4" rx="1" fill="#48c6ef"/>
                            <rect x="3" y="10" width="18" height="4" rx="1" fill="#667eea"/>
                            <rect x="3" y="16" width="18" height="4" rx="1" fill="#f093fb"/>
                        </svg>
                    </div>
                    <span className="logo-text">SQL Converter Tool</span>
                </div>

                {/* Right Container - Navigation Links & Button */}
                <div className={`navbar-nav-container ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div className="navbar-links">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveLink(link.id);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Sign Up Button */}
                    <button className="signup-button">
                        <span className="button-text">Sign Up</span>
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
