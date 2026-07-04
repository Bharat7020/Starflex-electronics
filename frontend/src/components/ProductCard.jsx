import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const BADGE_COLORS = {
  'Best Seller': 'blue',
  'Top Rated': 'cyan',
  'New': 'green',
  'Sale': 'red',
  'Popular': 'purple',
  'Gaming': 'purple',
  'Pro': 'blue',
  'Hot': 'red',
  'Creator': 'cyan',
  'default': 'blue',
};

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

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const badgeColor = BADGE_COLORS[product.badge] || BADGE_COLORS.default;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="product-card" role="article">
      <Link to={`/products/${product.id}`} className="product-card-img-wrap" aria-label={`View ${product.title}`}>
        {!imgLoaded && <div className="skeleton product-card-img-skeleton" />}
        <img
          src={imgError ? `https://placehold.co/600x400/111827/3b82f6?text=${encodeURIComponent(product.category)}` : product.image}
          alt={product.title}
          className={`product-card-img ${imgLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
        />
        {product.badge && (
          <span className={`product-card-badge badge badge-${badgeColor}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="product-card-discount">-{discount}%</span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="product-card-stock-warning">Only {product.stock} left!</span>
        )}
      </Link>

      <div className="product-card-body">
        <div className="product-card-header">
          <span className="product-card-category">{product.category}</span>
          <div className="product-card-rating">
            <StarRating rating={product.rating} />
            <span className="product-card-reviews">({product.reviews.toLocaleString()})</span>
          </div>
        </div>

        <Link to={`/products/${product.id}`} className="product-card-title" title={product.title}>
          {product.title}
        </Link>

        <div className="product-card-footer">
          <div className="product-card-prices">
            <span className="product-card-price">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-card-original">₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            id={`add-to-cart-${product.id}`}
            className={`btn btn-primary btn-sm product-card-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label={`Add ${product.title} to cart`}
          >
            {product.stock === 0 ? (
              <><i className="fa-solid fa-circle-xmark"></i> Out of Stock</>
            ) : added ? (
              <><i className="fa-solid fa-check"></i> Added!</>
            ) : (
              <><i className="fa-solid fa-plus"></i> Cart</>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
