'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Product Inquiry', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="section-label">Connect</div>
            <h1 className="contact-title">Reach <span className="gold-text">Out</span></h1>
            <p className="contact-subtitle">Inquire about our collection or share your sensory journey.</p>
          </motion.div>
        </div>
      </div>

      <section className="contact-section">
        <div className="container grid-split">
          <div className="contact-info">
            <div className="info-block">
              <h3>General Inquiries</h3>
              <p>curator@aurah.com</p>
            </div>
            <div className="info-block">
              <h3>Collection Curator</h3>
              <p>Malabar Coast, Heritage Estate<br />Kerala, India</p>
            </div>
            <div className="info-block">
              <h3>Wholesale &amp; Partnerships</h3>
              <p>noble@aurah.com</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {sent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-message"
              >
                <div className="symbol">✦</div>
                <h2>Inquiry Received</h2>
                <p>Our curator will respond to your request within two cycles.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: 'Product Inquiry', message: '' }); }} className="btn-link">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name">Full Name</label>
                  <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" required inputMode="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}>
                    <option>Product Inquiry</option>
                    <option>Wholesale</option>
                    <option>Heritage Report Request</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message">Your Message</label>
                  <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." rows="5" required />
                </div>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="submit-btn-arch" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page { min-height: 100vh; background: var(--bg-warm); }
        .contact-hero {
          padding: 200px 0 100px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .contact-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 100%, rgba(192,82,42,0.1) 0%, transparent 60%);
          border-bottom: 1px solid rgba(192,82,42,0.1);
        }
        .contact-title { font-size: clamp(3rem, 8vw, 6rem); margin-bottom: 2rem; color: #2C1A0E; }
        .contact-subtitle { font-family: var(--font-lora); font-style: italic; color: var(--muted); font-size: 1.2rem; }

        .contact-section { padding: 100px 0; }
        .grid-split {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 100px;
        }
        
        .info-block { margin-bottom: 60px; }
        .info-block h3 { 
          font-family: var(--font-playfair); 
          color: var(--gold); 
          font-size: 0.75rem; 
          text-transform: uppercase; 
          letter-spacing: 0.3em;
          margin-bottom: 15px;
        }
        .info-block p { 
          font-family: var(--font-playfair); 
          color: #2C1A0E; 
          font-size: 1.2rem; 
          line-height: 1.4;
        }

        .contact-form {
          background: #FAF4E8;
          border: 1px solid rgba(192,82,42,0.2);
          padding: 60px;
          box-shadow: var(--glow);
        }
        .form-group { margin-bottom: 30px; }
        .form-group label {
          display: block;
          font-family: var(--font-playfair);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--muted);
          margin-bottom: 10px;
        }
        input, select, textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(192,82,42,0.2);
          padding: 12px 0;
          font-family: var(--font-lora);
          font-size: 1rem;
          color: #2C1A0E;
          outline: none;
          transition: border-color 0.3s;
        }
        input:focus, select:focus, textarea:focus { border-color: var(--gold); }
        .form-error { color: #c0522a; font-size: 0.85rem; margin-bottom: 16px; }
        
        .submit-btn-arch {
          width: 100%;
          background: var(--gold);
          color: #F5EDD6;
          border: none;
          padding: 18px;
          font-family: var(--font-playfair);
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
          transition: var(--transition);
          min-height: 52px;
        }
        .submit-btn-arch:hover:not(:disabled) { background: var(--gold-dark); transform: translateY(-2px); }
        .submit-btn-arch:disabled { opacity: 0.6; cursor: not-allowed; }

        .success-message {
          text-align: center;
          padding: 80px 40px;
          background: #FAF4E8;
          border: 1px solid var(--gold);
        }
        .symbol { font-size: 3rem; color: var(--gold); margin-bottom: 20px; }
        .success-message h2 { color: #2C1A0E; margin-bottom: 12px; }
        .success-message p { color: var(--muted); }
        .btn-link { background: none; border: none; color: var(--gold); text-decoration: underline; cursor: pointer; margin-top: 20px; font-size: 0.9rem; }

        @media (max-width: 1024px) {
          .grid-split { grid-template-columns: 1fr; gap: 60px; }
          .contact-form { padding: 40px; }
        }
        @media (max-width: 640px) {
          .contact-hero { padding: 120px 0 60px; }
          .contact-section { padding: 60px 0; }
          .contact-form { padding: 24px; }
        }
      `}</style>
    </div>
  );
}
