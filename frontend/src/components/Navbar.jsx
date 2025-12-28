import { useState } from 'react';
import './Navbar.css';

function Navbar() {
    const [activeLink, setActiveLink] = useState('home');

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
                        <div className="icon-layer layer-1"></div>
                        <div className="icon-layer layer-2"></div>
                        <div className="icon-layer layer-3"></div>
                    </div>
                    <span className="logo-text">SQL Conversion Tool</span>
                </div>

                {/* Right Container - Navigation Links & Button */}
                <div className="navbar-nav-container">
                    <div className="navbar-links">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveLink(link.id);
                                }}
                            >
                                {link.label}
                                {activeLink === link.id && <span className="active-indicator"></span>}
                            </a>
                        ))}
                    </div>

                    {/* Sign Up Button */}
                    <button className="signup-button">
                        <span className="button-text">Sign Up</span>
                        <div className="button-glow"></div>
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
