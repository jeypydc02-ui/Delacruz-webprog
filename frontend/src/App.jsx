import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';
import { useAuthStore } from './store/authStore';
import { useWishlistStore } from './store/wishlistStore';
import HomePage          from './pages/HomePage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage      from './pages/WishlistPage';
import CheckoutPage      from './pages/CheckoutPage';
import ReturnsPage       from './pages/ReturnsPage';
import NotFoundPage      from './pages/NotFoundPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import VerifyEmailPage   from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage       from './pages/ProfilePage';
import OrdersPage        from './pages/OrdersPage';
import OrderDetailPage   from './pages/OrderDetailPage';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminProducts     from './pages/admin/AdminProducts';
import AdminOrders       from './pages/admin/AdminOrders';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminInventory    from './pages/admin/AdminInventory';
import AdminAnalytics    from './pages/admin/AdminAnalytics';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar /><CartDrawer />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

// Load wishlist from backend on auth change
function WishlistLoader() {
  const { user } = useAuthStore();
  const { load, clear } = useWishlistStore();
  useEffect(() => {
    if (user) {
      load();
    } else {
      clear();
    }
  }, [user?._id]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer />
        <WishlistLoader />
        <Routes>
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/verify-email"    element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders"   element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/users"    element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/inventory" element={<ProtectedRoute adminOnly><AdminInventory /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/"               element={<HomePage />} />
                <Route path="/products"       element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/wishlist"       element={<WishlistPage />} />
                <Route path="/checkout"       element={<CheckoutPage />} />
                <Route path="/returns"        element={<ReturnsPage />} />
                <Route path="/profile"        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/orders"         element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/orders/:id"     element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                <Route path="*"               element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
