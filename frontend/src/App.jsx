import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Hooks/Components
import { useToast } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import OrderSuccess from './pages/OrderSuccess';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Inner wrapper that has access to useNavigate (must be inside <Router>)
const AppContent = ({ showToast, ToastContainer }) => {
  const navigate = useNavigate();

  const handleAuthRequired = () => {
    navigate('/auth');
  };

  return (
    <CartProvider showToast={showToast} onAuthRequired={handleAuthRequired}>
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      <ToastContainer />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      
      <Footer />
    </CartProvider>
  );
};

function App() {
  const { showToast, ToastContainer } = useToast();

  return (
    <AuthProvider showToast={showToast}>
      <Router>
        <AppContent showToast={showToast} ToastContainer={ToastContainer} />
      </Router>
    </AuthProvider>
  );
}

export default App;
