const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

const getProducts = (req, res, next) => {
  try {
    let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const { search, category, minPrice, maxPrice, sort } = req.query;

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by price range
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      products = products.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      products = products.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      products.sort((a, b) => b.reviews - a.reviews);
    }

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = (req, res, next) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products (same category, excluding current)
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    res.json({ success: true, data: product, related });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductById };
