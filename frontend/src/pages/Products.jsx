import React, { useEffect, useState } from 'react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        const pData = await pRes.json();
        const cData = await cRes.json();
        setProducts(pData.data || pData);
        setCategories(cData.data || cData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products.filter(p => {
    const matchCat = selected === 'all' || p.category_id === parseInt(selected);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Product Catalog</h1>
        <p className="subtitle">Browse our curated selection of {products.length} products</p>
      </div>

      <div className="filters glass-panel">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="category-filters">
          <button className={`filter-btn ${selected === 'all' ? 'active' : ''}`} onClick={() => setSelected('all')}>All</button>
          {categories.map(c => (
            <button key={c.id} className={`filter-btn ${selected === c.id ? 'active' : ''}`} onClick={() => setSelected(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => <div key={i} className="product-skeleton glass-panel"></div>)}
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card glass-panel animate-slide-in">
              <div className="product-brand">{p.brand}</div>
              <h3 className="product-name">{p.name}</h3>
              <div className="product-specs">
                {p.specifications && Object.entries(p.specifications).slice(0, 3).map(([k, v]) => (
                  <span key={k} className="spec-chip">{k}: {v}</span>
                ))}
              </div>
              <div className="product-footer">
                <span className="product-price">₹{Number(p.price).toLocaleString()}</span>
                <span className={`stock-badge ${p.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {p.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <p>No products match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
