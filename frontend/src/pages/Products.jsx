import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/LoadingSpinner';
import './Products.css';

const CATEGORIES = ['All', 'Laptops', 'Smartphones', 'Audio', 'Tablets', 'Monitors', 'Cameras', 'Accessories', 'Components', 'Drones', 'Wearables', 'TVs', 'Storage', 'VR'];
const SORTS = [
  { value: 'rating', label: <><i className="fa-solid fa-star"></i> Top Rated</> },
  { value: 'popular', label: <><i className="fa-solid fa-fire"></i> Most Popular</> },
  { value: 'price-asc', label: <><i className="fa-solid fa-arrow-up-wide-short"></i> Price: Low to High</> },
  { value: 'price-desc', label: <><i className="fa-solid fa-arrow-down-wide-short"></i> Price: High to Low</> },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort,
        ...(activeCategory !== 'All' && { category: activeCategory }),
        ...(searchInput.trim() && { search: searchInput.trim() }),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      };
      const res = await fetchProducts(params);
      setProducts(res.data.data);
      setTotalCount(res.data.count);
    } catch {
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, sort, searchInput, priceRange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (searchInput.trim()) params.search = searchInput;
    if (sort !== 'rating') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [activeCategory, searchInput, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const clearFilters = () => {
    setSearchInput('');
    setActiveCategory('All');
    setSort('rating');
    setPriceRange([0, 250000]);
  };

  const hasActiveFilters = activeCategory !== 'All' || searchInput.trim() || sort !== 'rating' || priceRange[0] > 0 || priceRange[1] < 250000;

  return (
    <main className="page-wrapper page-enter">
      <div className="products-page container">
        {/* Page Header */}
        <div className="products-header">
          <div>
            <h1 className="h1">
              {searchInput ? `Results for "${searchInput}"` : activeCategory === 'All' ? 'All Products' : activeCategory}
            </h1>
            <p className="text-muted" aria-live="polite">
              {loading ? 'Loading...' : `${totalCount} product${totalCount !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <div className="products-header-actions">
            <button
              className={`btn btn-secondary btn-sm ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(v => !v)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <i className="fa-solid fa-sliders"></i> Filters {hasActiveFilters && <span className="filter-dot" />}
            </button>
            <select
              className="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort products"
            >
              {SORTS.map(s => (
                <option key={s.value} value={s.value} data-label={s.label}>
                  {/* Select options cannot contain HTML, so we use just text here but FA icons are matched via CSS or just accepted */}
                  {s.value === 'rating' ? 'Top Rated' : s.value === 'popular' ? 'Most Popular' : s.value === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <form className="products-search" onSubmit={handleSearch} role="search">
          <div className="products-search-wrap">
            <span className="products-search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="search"
              id="products-search"
              placeholder="Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="products-search-input"
              aria-label="Search products"
            />
            {searchInput && (
              <button
                type="button"
                className="products-search-clear"
                onClick={() => setSearchInput('')}
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel glass-card" id="filter-panel" role="region" aria-label="Filter options">
            <div className="filter-section">
              <h3 className="filter-label">Category</h3>
              <div className="category-chips">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <h3 className="filter-label">
                Price Range: <span className="filter-price-val">₹{priceRange[0]} — ₹{priceRange[1]}</span>
              </h3>
              <div className="price-range-wrap">
                <input
                  type="range"
                  min="0" max="250000" step="1000"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                  className="price-range-slider"
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  min="0" max="250000" step="1000"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  className="price-range-slider"
                  aria-label="Maximum price"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                <i className="fa-solid fa-xmark"></i> Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Category Quick Tabs */}
        {!showFilters && (
          <div className="category-tabs" role="tablist" aria-label="Filter by category">
            {CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : products.length > 0 ? (
          <div className="product-grid" aria-label="Products grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
