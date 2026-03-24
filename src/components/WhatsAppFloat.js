'use client';

const WHATSAPP_NUMBER = '917867899091';

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hi! I have a question about AURAH products.'
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        width: '60px',
        height: '60px',
        background: '#25d366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        zIndex: 800,
        textDecoration: 'none',
      }}
    >
      <span style={{ color: 'white', fontSize: '24px' }}>💬</span>
    </a>
  );
}
