import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">✦</span>
        <span className="brand-name">ShopAI</span>
      </Link>

      <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
        <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Home</Link></li>
        <li><Link to="/chat" className={isActive('/chat') ? 'active' : ''} onClick={() => setMobileOpen(false)}>AI Assistant</Link></li>
        <li><Link to="/products" className={isActive('/products') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Products</Link></li>
        <li><Link to="/admin" className={isActive('/admin') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Admin</Link></li>
      </ul>

      <Link to="/chat" className="btn-primary nav-cta">
        Start Chat →
      </Link>

      <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
};

export default Navbar;
