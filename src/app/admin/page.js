'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    // Determine auth: either proper admin login OR legacy PIN
    const isAdminUser = user && (user.role === 'admin' || user.email === 'shriramvasanthan@gmail.com');
    const [pinAuthed, setPinAuthed] = useState(false);
    const authed = isAdminUser || pinAuthed;

    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');
    const [activeTab, setActiveTab] = useState('orders');

    // Product form & editing state
    const [editingProduct, setEditingProduct] = useState(null);

    // Product form
    const [productForm, setProductForm] = useState({
        name: '', category: 'Spices', description: '', price: '', unit: '100g', stock: '100', image: '', featured: false,
    });
    const [productSuccess, setProductSuccess] = useState('');
    const [productError, setProductError] = useState('');
    const [saving, setSaving] = useState(false);

    // Products
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Orders
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Site Content
    const [siteContent, setSiteContent] = useState({
        hero_est: '', hero_label: '', hero_title: '', hero_desc: '', 
        hero_btn1_text: '', hero_btn2_text: '', hero_scroll_hint: '',
        collection_pre: '', collection_title: '', collection_desc: '', collection_counter: '',
        heritage_tag: '', heritage_title: '', heritage_desc: '', heritage_bg: '', 
        heritage_btn_text: '', heritage_frame_text: '',
        footer_cta_text: '', footer_cta_btn: '', footer_desc: '',
        footer_email: '', footer_address: '', footer_ig: '', footer_tw: '', footer_tagline: ''
    });
    const [loadingContent, setLoadingContent] = useState(false);
    const [savingContent, setSavingContent] = useState(false);
    const [contentMsg, setContentMsg] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (pin === ADMIN_PIN) { setPinAuthed(true); }
        else { setPinError('Incorrect PIN.'); }
    };

    useEffect(() => {
        if (authed && activeTab === 'orders') loadOrders();
        if (authed && activeTab === 'manage-products') loadProducts();
        if (authed && activeTab === 'content') loadContent();
    }, [authed, activeTab]);

    const loadOrders = async () => {
        setLoadingOrders(true);
        try {
            const r = await fetch('/api/orders');
            setOrders(await r.json());
        } catch { } finally { setLoadingOrders(false); }
    };

    const loadProducts = async () => {
        setLoadingProducts(true);
        try {
            const r = await fetch('/api/products');
            setProducts(await r.json());
        } catch { } finally { setLoadingProducts(false); }
    };

    const loadContent = async () => {
        setLoadingContent(true);
        try {
            const r = await fetch('/api/content');
            setSiteContent(await r.json());
        } catch { } finally { setLoadingContent(false); }
    };

    const handleContentChange = (e) => {
        setSiteContent(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        setSavingContent(true);
        setContentMsg('');
        try {
            const r = await fetch('/api/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siteContent)
            });
            if (!r.ok) throw new Error();
            setContentMsg('Site content updated live successfully!');
            setTimeout(() => setContentMsg(''), 3000);
        } catch {
            setContentMsg('Failed to update content.');
        } finally {
            setSavingContent(false);
        }
    };

    const handleEditClick = (p) => {
        setEditingProduct(p);
        setProductForm({
            name: p.name, category: p.category, description: p.description, 
            price: p.price, unit: p.unit, stock: p.stock, image: p.image, featured: p.featured
        });
        setActiveTab('upload');
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setProductForm({ name: '', category: 'Spices', description: '', price: '', unit: '100g', stock: '100', image: '', featured: false });
        setActiveTab('manage-products');
    };

    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setProductError('');
        try {
            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
            const method = editingProduct ? 'PATCH' : 'POST';

            const r = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productForm),
            });
            if (!r.ok) throw new Error();
            setProductSuccess(editingProduct ? 'Product updated successfully!' : 'Product uploaded successfully!');
            setProductForm({ name: '', category: 'Spices', description: '', price: '', unit: '100g', stock: '100', image: '', featured: false });
            setEditingProduct(null);
            setTimeout(() => {
                setProductSuccess('');
                setActiveTab('manage-products');
            }, 1000);
        } catch {
            setProductError('Failed to save product. Please try again.');
        } finally { setSaving(false); }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            loadOrders();
        } catch { }
    };

    const statusColors = {
        pending: 'badge-pending', processing: 'badge-processing',
        shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled',
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)' }}>
            <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '0.3em' }}>Loading...</div>
        </div>
    );

    if (!authed) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="login-logo">AURAH</div>
                    <div className="login-subtitle">Admin Portal</div>
                    <div className="gold-divider" />
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Admin PIN</label>
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Enter 4-digit PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                maxLength={4}
                                required
                            />
                        </div>
                        {pinError && <p style={{ color: '#F87171', fontSize: '0.8rem', marginBottom: '16px' }}>{pinError}</p>}
                        <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                            Enter Dashboard
                        </button>
                    </form>
                    <p style={{ marginTop: '16px', fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center' }}>
                        Secured Access
                    </p>
                </div>
                <style>{`
          .login-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(ellipse at 50% 50%, rgba(192,82,42,0.06) 0%, transparent 70%), #f5edd6;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            background: #faf4e8;
            border: 1px solid rgba(192,82,42,0.25);
            border-radius: 4px;
            padding: 48px;
            text-align: center;
            animation: fadeInUp 0.5s ease;
            box-shadow: 0 8px 40px rgba(44, 26, 14, 0.10);
          }
          .login-logo {
            font-family: var(--font-display);
            font-size: 2.22rem;
            font-weight: 900;
            letter-spacing: 0.35em;
            color: #2c1a0e;
            margin-bottom: 4px;
          }
          .login-subtitle {
            font-family: var(--font-display);
            font-size: 0.55rem;
            letter-spacing: 0.5em;
            color: var(--muted);
            text-transform: uppercase;
            margin-bottom: 24px;
          }
          .gold-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(192,82,42,0.3), transparent);
            margin-bottom: 32px;
          }
          .form-group { margin-bottom: 20px; text-align: left; }
          .form-label {
            display: block;
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #2c1a0e;
            margin-bottom: 8px;
            font-weight: 700;
          }
          .form-input {
            width: 100%;
            background: #faf4e8;
            border: 1px solid rgba(192,82,42,0.2);
            padding: 14px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
            color: #2c1a0e;
            border-radius: 4px;
            outline: none;
            transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          }
          .form-input:focus { border-color: #c0522a; box-shadow: 0 0 0 4px rgba(192,82,42,0.05); }
          .btn-gold {
            background: linear-gradient(135deg, #8b3c1e, #c0522a, #d96a38);
            border: none;
            color: #f5edd6;
            padding: 14px 28px;
            font-family: var(--font-display);
            font-size: 0.65rem;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            font-weight: 900;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.4s;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(192,82,42,0.2); }
          
          .admin-page { min-height: 100vh; background: #f5edd6; padding-bottom: 120px; color: #2c1a0e; }
          .admin-header {
            padding: 120px 0 60px;
            position: relative;
          }
          .admin-header-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 50% 100%, rgba(192,82,42,0.07) 0%, transparent 70%);
          }
          .admin-header-inner {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            position: relative;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 40px;
          }
          .admin-title { font-size: clamp(1.8rem, 3vw, 2.8rem); font-family: var(--font-display); font-weight: 900; letter-spacing: 0.05em; color: #2c1a0e; }
          .gold-text { color: #c0522a; }
          .admin-sub { font-family: 'Montserrat', sans-serif; color: var(--muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 12px; }
          .btn-outline {
            background: transparent;
            border: 1.5px solid #c0522a;
            color: #c0522a;
            padding: 10px 24px;
            font-family: var(--font-display);
            font-size: 0.6rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            font-weight: 900;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.4s;
          }
          .btn-outline:hover { background: #c0522a; color: #f5edd6; }
          
          .admin-content { max-width: 1400px; margin: 0 auto; padding: 48px 40px 0; }
          .admin-tabs {
            display: flex;
            gap: 12px;
            margin-bottom: 60px;
            border-bottom: 1px solid rgba(192, 82, 42, 0.1);
          }
          .admin-tab {
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            padding: 16px 32px;
            font-family: var(--font-display);
            font-size: 0.65rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--muted);
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: -1px;
            font-weight: 700;
          }
          .admin-tab:hover { color: #c0522a; }
          .admin-tab.active { color: #c0522a; border-bottom-color: #c0522a; }
          
          .orders-section { animation: fadeInUp 0.6s ease; }
          .orders-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
          .tab-title { font-family: var(--font-display); font-size: 1.4rem; color: #2c1a0e; letter-spacing: 0.05em; }
          .order-count { color: #c0522a; font-size: 1rem; margin-left: 12px; }
          
          .orders-table-wrap { overflow-x: auto; border-radius: 8px; background: #ede4cc; border: 1px solid rgba(192,82,42,0.08); box-shadow: 0 4px 24px rgba(44, 26, 14, 0.04); }
          .orders-table { width: 100%; border-collapse: collapse; }
          .orders-table th {
            background: #e5d9b8;
            padding: 18px 24px;
            font-family: var(--font-display);
            font-size: 0.55rem;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #8b3c1e;
            text-align: left;
            border-bottom: 1px solid rgba(192,82,42,0.1);
          }
          .orders-table td {
            padding: 20px 24px;
            border-top: 1px solid rgba(192,82,42,0.05);
            font-family: 'Montserrat', sans-serif;
            font-size: 0.8rem;
            color: #2c1a0e;
            vertical-align: middle;
            font-weight: 500;
          }
          .orders-table tr:hover td { background: rgba(192,82,42,0.03); }
          .order-id { font-family: var(--font-display); color: #c0522a; font-weight: 900; font-size: 0.9rem; }
          .customer-name { font-weight: 700; color: #2c1a0e; margin-bottom: 4px; font-size: 0.85rem; }
          
          .badge {
            padding: 6px 14px;
            border-radius: 4px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 700;
            display: inline-block;
          }
          .badge-pending { background: rgba(202,138,4,0.12); color: #92610a; }
          .badge-shipped { background: rgba(124,58,237,0.1); color: #6d28d9; }
          .badge-delivered { background: rgba(22,163,74,0.1); color: #15803d; }
          .badge-cancelled { background: rgba(220,38,38,0.1); color: #991b1b; }
          .badge-processing { background: rgba(37,99,235,0.1); color: #1e40af; }
          
          .upload-form { max-width: 800px; background: #faf4e8; border: 1px solid rgba(192,82,42,0.15); border-radius: 8px; padding: 50px; box-shadow: 0 10px 40px rgba(44, 26, 14, 0.06); }
          .form-textarea {
            width: 100%;
            background: #faf4e8;
            border: 1px solid rgba(192,82,42,0.2);
            padding: 16px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
            min-height: 120px;
            border-radius: 4px;
            color: #2c1a0e;
            outline: none;
            transition: all 0.3s;
          }
          .form-textarea:focus { border-color: #c0522a; }
          
          .status-select {
            background: #e5d9b8;
            border: 1px solid rgba(192,82,42,0.2);
            color: #2c1a0e;
            padding: 8px 12px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            border-radius: 4px;
            text-transform: uppercase;
            cursor: pointer;
            outline: none;
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 1024px) {
            .admin-header-inner, .admin-content { padding: 0 24px; }
            .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
          }
        `}</style>
            </div>
        );
    }

    return (
        <>
            <div className="admin-page">
                <div className="admin-header">
                    <div className="admin-header-bg" />
                    <div className="container admin-header-inner">
                        <div>
                            <h1 className="admin-title">Admin <span className="gold-text">Dashboard</span></h1>
                            <p className="admin-sub">
                                {isAdminUser ? `Logged in as ${user.name}` : 'Manage products & orders'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container admin-content">
                    {/* Tabs */}
                    <div className="admin-tabs">
                        {[
                            { id: 'orders', label: 'Orders', icon: '📦' },
                            { id: 'manage-products', label: 'Manage Products', icon: '📋' },
                            { id: 'upload', label: editingProduct ? 'Edit Product' : 'Upload Product', icon: '✦' },
                            { id: 'content', label: 'Site Content', icon: '✒️' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="orders-section">
                            <div className="orders-toolbar">
                                <h2 className="tab-title">All Orders <span className="order-count">({orders.length})</span></h2>
                                <button className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.65rem' }} onClick={loadOrders}>
                                    Refresh
                                </button>
                            </div>
                            {loadingOrders ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gold)' }}>Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="empty-state">
                                    <div style={{ fontSize: '3rem', color: 'rgba(201,168,76,0.2)', marginBottom: '16px' }}>📭</div>
                                    <p>No orders yet. Orders will appear here once customers place them.</p>
                                </div>
                            ) : (
                                <div className="orders-table-wrap">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Customer</th>
                                                <th>Contact & Address</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="order-id">#{order.id}</td>
                                                    <td>
                                                        <div className="customer-name">{order.customerName}</div>
                                                    </td>
                                                    <td>
                                                        <div className="customer-email" style={{ marginBottom: '4px' }}>{order.email}</div>
                                                        <div className="customer-email" style={{ marginBottom: '4px' }}>{order.phone}</div>
                                                        <div className="customer-email" style={{ whiteSpace: 'normal', minWidth: '150px' }}>{order.address}</div>
                                                    </td>
                                                    <td>
                                                        {order.items.map((i) => (
                                                            <div key={i.id} className="order-item-line">
                                                                {i.product.name} × {i.quantity}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="order-total">{formatPrice(order.total)}</td>
                                                    <td className="order-date">
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${statusColors[order.status] || 'badge-gold'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="status-select"
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        >
                                                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Manage Products Tab */}
                    {activeTab === 'manage-products' && (
                        <div className="orders-section">
                            <div className="orders-toolbar">
                                <h2 className="tab-title">Manage Products <span className="order-count">({products.length})</span></h2>
                                <button className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.65rem' }} onClick={() => setActiveTab('upload')}>
                                    + Add New Product
                                </button>
                            </div>
                            {loadingProducts ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gold)' }}>Loading products...</div>
                            ) : products.length === 0 ? (
                                <div className="empty-state">
                                    <p>No products found in the catalog.</p>
                                </div>
                            ) : (
                                <div className="orders-table-wrap">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name & Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Featured</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((p) => (
                                                <tr key={p.id}>
                                                    <td>
                                                        <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = 'https://placehold.co/40x40/1E1E1E/C9A84C?text=' + p.name[0]; }} />
                                                    </td>
                                                    <td>
                                                        <div className="customer-name">{p.name}</div>
                                                        <div className="customer-email">{p.category} | {p.unit}</div>
                                                    </td>
                                                    <td className="order-total">{formatPrice(p.price)}</td>
                                                    <td>{p.stock}</td>
                                                    <td>
                                                        <span className={`badge ${p.featured ? 'badge-processing' : 'badge-gold'}`}>
                                                            {p.featured ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn-outline" 
                                                            style={{ padding: '6px 12px', fontSize: '0.6rem' }}
                                                            onClick={() => handleEditClick(p)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload / Edit Product Tab */}
                    {activeTab === 'upload' && (
                        <div className="upload-section">
                            <h2 className="tab-title">{editingProduct ? `Editing: ${editingProduct.name}` : 'Upload New Product'}</h2>
                            {productSuccess && (
                                <div className="success-banner">✦ {productSuccess}</div>
                            )}
                            {productError && <div className="error-banner">⚠ {productError}</div>}
                            <form className="upload-form" onSubmit={handleProductSubmit}>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Product Name *</label>
                                        <input className="form-input" name="name" value={productForm.name} onChange={handleProductChange} required placeholder="e.g. Organic Cardamom" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select className="form-select" name="category" value={productForm.category} onChange={handleProductChange}>
                                            <option>Spices</option>
                                            <option>Nuts</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description *</label>
                                    <textarea className="form-textarea" name="description" value={productForm.description} onChange={handleProductChange} required placeholder="Describe the product..." />
                                </div>
                                <div className="form-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">Price (USD) *</label>
                                        <input className="form-input" type="number" name="price" value={productForm.price} onChange={handleProductChange} required min="0.01" step="0.01" placeholder="9.99" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Unit *</label>
                                        <input className="form-input" name="unit" value={productForm.unit} onChange={handleProductChange} required placeholder="100g, 250g, 1kg..." />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stock</label>
                                        <input className="form-input" type="number" name="stock" value={productForm.stock} onChange={handleProductChange} min="0" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input className="form-input" name="image" value={productForm.image} onChange={handleProductChange} placeholder="https://... or /products/myimage.jpg" />
                                </div>
                                <div className="form-group featured-toggle">
                                    <label className="toggle-label">
                                        <input type="checkbox" name="featured" checked={productForm.featured} onChange={handleProductChange} className="toggle-checkbox" />
                                        <div className="toggle-track">
                                            <div className="toggle-thumb" />
                                        </div>
                                        <span>Mark as Featured Product</span>
                                    </label>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button type="submit" className="btn-gold" style={{ minWidth: '200px' }} disabled={saving}>
                                        {saving ? 'Saving...' : (editingProduct ? '✦ Save Changes' : '✦ Upload Product')}
                                    </button>
                                    {editingProduct && (
                                        <button type="button" className="btn-outline" onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Site Content CMS Tab */}
                    {activeTab === 'content' && (
                        <div className="upload-section">
                            <h2 className="tab-title">Manage Site Content</h2>
                            {contentMsg && (
                                <div className={contentMsg.includes('Failed') ? 'error-banner' : 'success-banner'}>
                                    {contentMsg.includes('Failed') ? '⚠' : '✦'} {contentMsg}
                                </div>
                            )}
                            
                            {loadingContent ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gold)' }}>Loading content...</div>
                            ) : (
                                <form className="upload-form" onSubmit={handleContentSubmit}>
                                    {/* Hero Section */}
                                    <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid rgba(192,82,42,0.1)' }}>
                                        <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '24px' }}>1. Hero Section (Home Top)</h3>
                                        <div className="form-grid-2">
                                            <div className="form-group">
                                                <label className="form-label">EST. Year Label</label>
                                                <input className="form-input" name="hero_est" value={siteContent.hero_est || ''} onChange={handleContentChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Nature's Specimens Label</label>
                                                <input className="form-input" name="hero_label" value={siteContent.hero_label || ''} onChange={handleContentChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hero Main Title <span style={{ textTransform: 'none', color: 'var(--muted)', fontWeight: 'normal' }}>(HTML Allowed)</span></label>
                                            <input className="form-input" name="hero_title" value={siteContent.hero_title || ''} onChange={handleContentChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hero Description</label>
                                            <textarea className="form-textarea" name="hero_desc" value={siteContent.hero_desc || ''} onChange={handleContentChange} required style={{ minHeight: '80px' }} />
                                        </div>
                                        <div className="form-grid-3">
                                            <div className="form-group">
                                                <label className="form-label">Button 1 (Explore)</label>
                                                <input className="form-input" name="hero_btn1_text" value={siteContent.hero_btn1_text || ''} onChange={handleContentChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Button 2 (Story)</label>
                                                <input className="form-input" name="hero_btn2_text" value={siteContent.hero_btn2_text || ''} onChange={handleContentChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Scroll Hint Label</label>
                                                <input className="form-input" name="hero_scroll_hint" value={siteContent.hero_scroll_hint || ''} onChange={handleContentChange} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Collection Section */}
                                    <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid rgba(192,82,42,0.1)' }}>
                                        <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '24px' }}>2. Featured Collection Section</h3>
                                        <div className="form-group">
                                            <label className="form-label">Section Tag Label</label>
                                            <input className="form-input" name="collection_pre" value={siteContent.collection_pre || ''} onChange={handleContentChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Collection Title</label>
                                            <input className="form-input" name="collection_title" value={siteContent.collection_title || ''} onChange={handleContentChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Collection Description</label>
                                            <textarea className="form-textarea" name="collection_desc" value={siteContent.collection_desc || ''} onChange={handleContentChange} style={{ minHeight: '80px' }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Collection Counter Text</label>
                                            <input className="form-input" name="collection_counter" value={siteContent.collection_counter || ''} onChange={handleContentChange} />
                                        </div>
                                    </div>

                                    {/* Heritage Section */}
                                    <div style={{ marginBottom: '48px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '24px' }}>3. Heritage Section (Bottom)</h3>
                                        <div className="form-grid-2">
                                            <div className="form-group">
                                                <label className="form-label">Philosophy Tag</label>
                                                <input className="form-input" name="heritage_tag" value={siteContent.heritage_tag || ''} onChange={handleContentChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Frame Overlay Text</label>
                                                <input className="form-input" name="heritage_frame_text" value={siteContent.heritage_frame_text || ''} onChange={handleContentChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Heritage Title <span style={{ textTransform: 'none', color: 'var(--muted)', fontWeight: 'normal' }}>(HTML Allowed)</span></label>
                                            <input className="form-input" name="heritage_title" value={siteContent.heritage_title || ''} onChange={handleContentChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Heritage Description</label>
                                            <textarea className="form-textarea" name="heritage_desc" value={siteContent.heritage_desc || ''} onChange={handleContentChange} required style={{ minHeight: '120px' }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Background Image URL</label>
                                            <input className="form-input" name="heritage_bg" value={siteContent.heritage_bg || ''} onChange={handleContentChange} required placeholder="https://..." />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Button Text</label>
                                            <input className="form-input" name="heritage_btn_text" value={siteContent.heritage_btn_text || ''} onChange={handleContentChange} />
                                        </div>
                                        {siteContent.heritage_bg && (
                                            <div style={{ marginTop: '16px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(192,82,42,0.2)', height: '140px', background: 'var(--dark)' }}>
                                                <img src={siteContent.heritage_bg} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Heritage Background Preview" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Section */}
                                    <div style={{ marginBottom: '48px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '24px' }}>4. Global Footer Content</h3>
                                        <div className="form-group">
                                            <label className="form-label">Footer CTA Heading</label>
                                            <input className="form-input" name="footer_cta_text" value={siteContent.footer_cta_text || ''} onChange={handleContentChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Footer CTA Button Text</label>
                                            <input className="form-input" name="footer_cta_btn" value={siteContent.footer_cta_btn || ''} onChange={handleContentChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Footer Short Description</label>
                                            <textarea className="form-textarea" name="footer_desc" value={siteContent.footer_desc || ''} onChange={handleContentChange} style={{ minHeight: '80px' }} />
                                        </div>
                                        <div className="form-grid-2">
                                            <div className="form-group">
                                                <label className="form-label">Contact Email</label>
                                                <input className="form-input" name="footer_email" value={siteContent.footer_email || ''} onChange={handleContentChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Physical Address</label>
                                                <input className="form-input" name="footer_address" value={siteContent.footer_address || ''} onChange={handleContentChange} />
                                            </div>
                                        </div>
                                        <div className="form-grid-2">
                                            <div className="form-group">
                                                <label className="form-label">Instagram URL</label>
                                                <input className="form-input" name="footer_ig" value={siteContent.footer_ig || ''} onChange={handleContentChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Twitter URL</label>
                                                <input className="form-input" name="footer_tw" value={siteContent.footer_tw || ''} onChange={handleContentChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Copyright Tagline</label>
                                            <input className="form-input" name="footer_tagline" value={siteContent.footer_tagline || ''} onChange={handleContentChange} />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={savingContent}>
                                        {savingContent ? 'Publishing Changes...' : '✦ Save All Site Content'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .admin-page { min-height: 100vh; padding-bottom: 80px; }
        .admin-header {
          padding: 120px 0 40px;
          position: relative;
          border-bottom: 1px solid rgba(192, 82, 42, 0.12);
        }
        .admin-header-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 100%, rgba(192,82,42,0.07) 0%, transparent 70%);
        }
        .admin-header-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          position: relative;
        }
        .admin-title { font-size: clamp(1.8rem, 3vw, 2.8rem); }
        .admin-sub { color: var(--muted); font-size: 0.85rem; margin-top: 8px; }
        .admin-content { padding-top: 48px; }
        .admin-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(192, 82, 42, 0.12);
        }
        .admin-tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 16px 28px;
          font-family: var(--font-display);
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: -1px;
        }
        .admin-tab:hover { color: var(--gold); }
        .admin-tab.active { color: var(--gold-dark); border-bottom-color: var(--gold); }
        .tab-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: var(--white);
          margin-bottom: 28px;
        }
        .order-count { color: var(--gold); font-size: 0.9rem; }
        .orders-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .orders-table-wrap { overflow-x: auto; border-radius: 4px; border: 1px solid rgba(192,82,42,0.12); }
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th {
          background: var(--dark-2);
          padding: 14px 16px;
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-dark);
          text-align: left;
          white-space: nowrap;
        }
        .orders-table td {
          padding: 14px 16px;
          border-top: 1px solid rgba(192,82,42,0.07);
          font-size: 0.83rem;
          color: var(--white);
          vertical-align: top;
        }
        .orders-table tr:hover td { background: rgba(192,82,42,0.03); }
        .order-id { font-family: var(--font-display); color: var(--gold); font-weight: 700; }
        .customer-name { font-weight: 600; margin-bottom: 4px; }
        .customer-email { font-size: 0.75rem; color: var(--muted); }
        .order-item-line { font-size: 0.78rem; color: var(--muted); margin-bottom: 2px; white-space: nowrap; }
        .order-total { font-family: var(--font-display); font-weight: 700; color: var(--gold); white-space: nowrap; }
        .order-date { font-size: 0.78rem; color: var(--muted); white-space: nowrap; }
        .status-select {
          background: var(--dark-2);
          border: 1px solid rgba(192,82,42,0.2);
          color: var(--white);
          padding: 6px 10px;
          font-size: 0.75rem;
          border-radius: 2px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.3s;
        }
        .status-select:focus { border-color: var(--gold); }
        .empty-state { text-align: center; padding: 80px; color: var(--muted); font-size: 0.9rem; }
        .upload-section { max-width: 700px; }
        .upload-form { background: #FAF4E8; border: 1px solid rgba(192,82,42,0.12); border-radius: 4px; padding: 40px; box-shadow: 0 2px 12px rgba(44, 26, 14, 0.05); }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .success-banner {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          color: #4ADE80;
          padding: 14px 20px;
          border-radius: 2px;
          font-size: 0.88rem;
          margin-bottom: 24px;
          animation: fadeInUp 0.3s ease;
        }
        .error-banner {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);
          color: #F87171;
          padding: 14px 20px;
          border-radius: 2px;
          font-size: 0.88rem;
          margin-bottom: 24px;
        }
        .featured-toggle { margin-bottom: 28px; }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 0.88rem;
          color: var(--white);
        }
        .toggle-checkbox { display: none; }
        .toggle-track {
          width: 44px;
          height: 24px;
          background: var(--dark-4);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .toggle-checkbox:checked + .toggle-track {
          background: var(--gold);
        }
        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }
        .toggle-checkbox:checked + .toggle-track .toggle-thumb {
          transform: translateX(20px);
        }
        @media (max-width: 640px) {
          .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
          .upload-form { padding: 24px; }
          .admin-header-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
        }
      `}</style>
        </>
    );
}
