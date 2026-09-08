import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  { icon: '🧠', title: 'AI-Powered Understanding', desc: 'Our Gemini-powered assistant understands your needs in natural language — budget, use case, and preferences.' },
  { icon: '🔍', title: 'Semantic Product Search', desc: 'RAG-based retrieval finds the most semantically relevant products from our catalog using real embeddings.' },
  { icon: '⚖️', title: 'Smart Compatibility Check', desc: 'Automatically checks GPU needs, OS preferences, and technical level to filter incompatible products.' },
  { icon: '💰', title: 'Dynamic Budget Reasoning', desc: 'Suggests alternatives just outside your budget when they offer significantly better value.' },
  { icon: '📋', title: 'Shopping List Builder', desc: 'Get a complete recommended setup — laptop, accessories, and peripherals — in one conversation.' },
  { icon: '⚡', title: 'Real-time Conversation', desc: 'Multi-turn conversational memory refines recommendations as you share more details.' },
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge animate-slide-in">✦ Powered by Gemini AI + RAG</div>
        <h1 className="hero-title animate-slide-in" style={{ animationDelay: '0.1s' }}>
          Find Your Perfect<br />Product with AI
        </h1>
        <p className="hero-subtitle animate-slide-in" style={{ animationDelay: '0.2s' }}>
          Tell us what you need in plain English. Our AI assistant understands your budget,
          use cases, and preferences to recommend the perfect laptop — instantly.
        </p>
        <div className="hero-actions animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <Link to="/chat" className="btn-primary hero-cta">
            Start AI Chat →
          </Link>
          <Link to="/products" className="btn-secondary">
            Browse Products
          </Link>
        </div>

        {/* Floating orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why ShopAI?</h2>
        <p className="section-subtitle">A recommendation engine that thinks like a human expert.</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-panel animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box glass-panel">
          <h2>Ready to find your perfect match?</h2>
          <p>One conversation is all it takes.</p>
          <Link to="/chat" className="btn-primary">
            Chat with AI Now →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
