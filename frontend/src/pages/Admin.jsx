import React, { useEffect, useState } from 'react';
import './Admin.css';

const BACKEND = '/api';

const emptyForm = {
  name: '',
  brand: '',
  price: '',
  stock_quantity: '',
  category_id: '',
  status: 'active',
  spec_ram_gb: '',
  spec_storage_gb: '',
  spec_storage_type: 'SSD',
  spec_os: '',
  spec_screen_size: '',
  spec_gpu: '',
  spec_weight_kg: ''
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${BACKEND}/products`),
        fetch(`${BACKEND}/categories`)
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData.data || pData);
      setCategories(cData.data || cData);
    } catch (err) {
      showToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const specs = {};
      if (form.spec_ram_gb) specs.ram_gb = Number(form.spec_ram_gb);
      if (form.spec_storage_gb) specs.storage_gb = Number(form.spec_storage_gb);
      if (form.spec_storage_type) specs.storage_type = form.spec_storage_type;
      if (form.spec_os) specs.os = form.spec_os;
      if (form.spec_screen_size) specs.screen_size = Number(form.spec_screen_size);
      if (form.spec_gpu) specs.gpu = form.spec_gpu;
      if (form.spec_weight_kg) specs.weight_kg = Number(form.spec_weight_kg);

      const body = {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        category_id: Number(form.category_id),
        status: form.status,
        specifications: specs
      };

      const url = editId ? `${BACKEND}/products/${editId}` : `${BACKEND}/products`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Request failed');

      showToast(editId ? 'Product updated!' : 'Product added!');
      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      showToast('Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id,
      status: product.status || 'active',
      spec_ram_gb: product.specifications?.ram_gb || '',
      spec_storage_gb: product.specifications?.storage_gb || '',
      spec_storage_type: product.specifications?.storage_type || 'SSD',
      spec_os: product.specifications?.os || '',
      spec_screen_size: product.specifications?.screen_size || '',
      spec_gpu: product.specifications?.gpu || '',
      spec_weight_kg: product.specifications?.weight_kg || ''
    });
    setEditId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Product deleted');
      setConfirmDelete(null);
      fetchProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : '—';
  };

  return (
    <div className="admin-page">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal glass-panel">
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">{products.length} products in catalog</p>
        </div>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add Product
          </button>
        )}
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="product-form-wrap glass-panel animate-slide-in">
          <h2>{editId ? 'Edit Product' : 'Add New Product'}</h2>
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-section-title">Basic Info</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. MacBook Pro 16" />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="e.g. Apple" />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 150000" />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input required type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} placeholder="e.g. 50" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="form-section-title" style={{marginTop: '1.5rem'}}>Specifications (Optional)</div>
            <div className="form-grid">
              <div className="form-group">
                <label>RAM (GB)</label>
                <input type="number" value={form.spec_ram_gb} onChange={e => setForm({...form, spec_ram_gb: e.target.value})} placeholder="e.g. 16" />
              </div>
              <div className="form-group">
                <label>Storage (GB)</label>
                <input type="number" value={form.spec_storage_gb} onChange={e => setForm({...form, spec_storage_gb: e.target.value})} placeholder="e.g. 512" />
              </div>
              <div className="form-group">
                <label>Storage Type</label>
                <select value={form.spec_storage_type} onChange={e => setForm({...form, spec_storage_type: e.target.value})}>
                  <option value="SSD">SSD</option>
                  <option value="HDD">HDD</option>
                  <option value="eMMC">eMMC</option>
                </select>
              </div>
              <div className="form-group">
                <label>Operating System</label>
                <input value={form.spec_os} onChange={e => setForm({...form, spec_os: e.target.value})} placeholder="e.g. Windows 11" />
              </div>
              <div className="form-group">
                <label>Screen Size (inches)</label>
                <input type="number" step="0.1" value={form.spec_screen_size} onChange={e => setForm({...form, spec_screen_size: e.target.value})} placeholder="e.g. 15.6" />
              </div>
              <div className="form-group">
                <label>GPU (Graphics)</label>
                <input value={form.spec_gpu} onChange={e => setForm({...form, spec_gpu: e.target.value})} placeholder="e.g. RTX 4060" />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.01" value={form.spec_weight_kg} onChange={e => setForm({...form, spec_weight_kg: e.target.value})} placeholder="e.g. 1.5" />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" className="btn-ghost" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="table-wrap glass-panel">
        {loading ? (
          <div className="loading-row">Loading products...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="muted">#{p.id}</td>
                  <td className="product-name-cell">{p.name}</td>
                  <td className="muted">{p.brand}</td>
                  <td><span className="cat-badge">{getCategoryName(p.category_id)}</span></td>
                  <td className="price-cell">₹{Number(p.price).toLocaleString()}</td>
                  <td>{p.stock_quantity}</td>
                  <td>
                    <span className={`status-badge ${p.status}`}>{p.status}</span>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn edit" onClick={() => handleEdit(p)}>✏️</button>
                    <button className="icon-btn delete" onClick={() => setConfirmDelete(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
