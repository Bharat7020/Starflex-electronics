import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import './ProductDetail.css';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="star">
          {i < full ? (
            <i className="fa-solid fa-star"></i>
          ) : (i === full && half) ? (
            <i className="fa-solid fa-star-half-stroke"></i>
          ) : (
            <i className="fa-regular fa-star"></i>
          )}
        </span>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(id);
        setProduct(res.data.data);
        setRelated(res.data.related || []);
        setActiveImg(0);
      } catch {
        navigate('/products', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addItem(product, quantity);
    setAdded(true);
    setAdding(false);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return <div className="page-wrapper"><LoadingSpinner text="Loading product..." /></div>;
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.gallery?.length > 0 ? product.gallery : [product.image];

  return (
    <main className="page-wrapper page-enter">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
          <Link to="/products" className="breadcrumb-item">Products</Link>
          <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
          <Link to={`/products?category=${product.category}`} className="breadcrumb-item">{product.category}</Link>
          <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
          <span className="breadcrumb-current">{product.title}</span>
        </nav>

        {/* Product Layout */}
        <div className="pd-layout">
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-img-wrap">
              <img
                src={images[activeImg]}
                alt={product.title}
                className="pd-main-img"
                onError={e => { e.target.src = `https://placehold.co/600x400/111827/3b82f6?text=${encodeURIComponent(product.category)}`; }}
              />
              {discount > 0 && (
                <span className="pd-discount">-{discount}% OFF</span>
              )}
              {product.badge && (
                <span className="badge badge-blue pd-badge">{product.badge}</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="pd-thumbnails">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.title} view ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-category">{product.category}</div>
            <h1 className="pd-title">{product.title}</h1>

            <div className="pd-rating-row">
              <StarRating rating={product.rating} />
              <span className="pd-rating-val">{product.rating}</span>
              <span className="pd-rating-count">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="pd-original">₹{product.originalPrice.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <span className="pd-save-badge">Save {discount}%</span>
              )}
            </div>

            <p className="pd-description">{product.description}</p>

            {/* Stock status */}
            <div className={`pd-stock ${product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}`}>
              {product.stock > 5
                ? <><i className="fa-solid fa-circle-check"></i> In Stock ({product.stock} available)</>
                : product.stock > 0
                  ? <><i className="fa-solid fa-triangle-exclamation"></i> Only {product.stock} left in stock!</>
                  : <><i className="fa-solid fa-circle-xmark"></i> Out of Stock</>}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="pd-qty-row">
                <span className="pd-qty-label">Quantity:</span>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  ><i className="fa-solid fa-minus"></i></button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    aria-label="Increase quantity"
                    disabled={quantity >= product.stock}
                  ><i className="fa-solid fa-plus"></i></button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pd-actions">
              <button
                id={`add-to-cart-detail-${product.id}`}
                className={`btn btn-primary btn-lg ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                aria-label={`Add ${product.title} to cart`}
                style={{ flex: 1 }}
              >
                {product.stock === 0 ? (
                  <><i className="fa-solid fa-circle-xmark"></i> Out of Stock</>
                ) : adding ? (
                  'Adding...'
                ) : added ? (
                  <><i className="fa-solid fa-check"></i> Added to Cart!</>
                ) : (
                  <><i className="fa-solid fa-cart-plus"></i> Add to Cart</>
                )}
              </button>
              {product.stock > 0 && (
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={handleBuyNow}
                  style={{ flex: 1 }}
                >
                  <i className="fa-solid fa-bolt-lightning"></i> Buy Now
                </button>
              )}
            </div>

            {/* Guarantees */}
            <div className="pd-guarantees">
              {[
                [<i className="fa-solid fa-truck-fast"></i>, 'Free shipping on orders ₹4,999+'],
                [<i className="fa-solid fa-arrow-rotate-left"></i>, '30-day hassle-free returns'],
                [<i className="fa-solid fa-shield-halved"></i>, 'Secure checkout'],
                [<i className="fa-solid fa-certificate"></i>, '2-year warranty'],
              ].map(([icon, text]) => (
                <div key={text} className="pd-guarantee">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs-section">
          <div className="pd-tabs" role="tablist">
            {['overview', 'specs', 'reviews'].map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' ? (
                  <><i className="fa-solid fa-circle-info"></i> Overview</>
                ) : tab === 'specs' ? (
                  <><i className="fa-solid fa-gear"></i> Specs</>
                ) : (
                  <><i className="fa-solid fa-star"></i> Reviews</>
                )}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'overview' && (
              <div className="pd-overview">
                <h2>Product Overview</h2>
                <p>{product.description}</p>
                <div className="pd-overview-highlights">
                  <h3>Key Highlights</h3>
                  {product.specs && Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="pd-highlight">
                      <span className="pd-highlight-dot" />
                      <strong>{k}:</strong> {v}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="pd-specs-table">
                <h2>Technical Specifications</h2>
                {product.specs ? (
                  <table aria-label="Technical specifications">
                    <tbody>
                      {Object.entries(product.specs).map(([k, v]) => (
                        <tr key={k}>
                          <td className="spec-key">{k}</td>
                          <td className="spec-val">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-muted">No specifications available.</p>}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="pd-reviews">
                <h2>Customer Reviews</h2>
                <div className="pd-reviews-summary">
                  <div className="pd-reviews-score">
                    <span className="pd-reviews-number">{product.rating}</span>
                    <StarRating rating={product.rating} />
                    <span className="text-muted">{product.reviews.toLocaleString()} reviews</span>
                  </div>
                  <div className="pd-review-bars">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="pd-review-bar-row">
                        <span className="pd-review-bar-label">{star}<i className="fa-solid fa-star" style={{ fontSize: '0.7em' }}></i></span>
                        <div className="pd-review-bar-track">
                          <div
                            className="pd-review-bar-fill"
                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 6 : star === 2 ? 2 : 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pd-related">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
              <h2 className="h2">Related <span className="text-gradient">Products</span></h2>
            </div>
            <div className="product-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
