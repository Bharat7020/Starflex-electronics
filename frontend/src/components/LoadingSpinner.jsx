export const LoadingSpinner = ({ size = 'md', text = '' }) => (
  <div className="loading-center">
    <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} role="status" aria-label="Loading" />
    {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>}
  </div>
);

export const SkeletonCard = () => (
  <div style={{
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-glass)',
  }}>
    <div className="skeleton" style={{ height: '220px' }} />
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="skeleton" style={{ height: '14px', width: '60%' }} />
      <div className="skeleton" style={{ height: '20px', width: '85%' }} />
      <div className="skeleton" style={{ height: '14px', width: '40%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <div className="skeleton" style={{ height: '28px', width: '80px' }} />
        <div className="skeleton" style={{ height: '36px', width: '100px', borderRadius: '8px' }} />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="product-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);
