import { Switch, Route, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import '@/lib/api-auth'; // Initialize API client with token from localStorage
import { AuthProvider } from '@/hooks/use-auth';

// Import pages
import HomePage from '@/pages/customer/home';
import ProductsPage from '@/pages/customer/products';
import ProductDetailPage from '@/pages/customer/product-detail';
import CartPage from '@/pages/customer/cart';
import WishlistPage from '@/pages/customer/wishlist';
import CheckoutPage from '@/pages/customer/checkout';
import CustomerOrdersPage from '@/pages/customer/orders';
import OrderDetailPage from '@/pages/customer/order-detail';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import AdminLoginPage from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminProductsPage from '@/pages/admin/products';
import AdminProductForm from '@/pages/admin/product-form';
import AdminOrdersPage from '@/pages/admin/orders';
import NotFound from '@/pages/not-found';

import CategoriesPage from '@/pages/customer/categories';
import ProfilePage from '@/pages/customer/profile';
import AboutPage from '@/pages/customer/about';
import ContactPage from '@/pages/customer/contact';
import FaqPage from '@/pages/customer/faq';
import AdminCategoriesPage from '@/pages/admin/categories';
import AdminCustomersPage from '@/pages/admin/customers';
import AdminInventoryPage from '@/pages/admin/inventory';
import AdminCouponsPage from '@/pages/admin/coupons';
import AdminMessagesPage from '@/pages/admin/messages';
import AdminReportsPage from '@/pages/admin/reports';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Customer Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/orders" component={CustomerOrdersPage} />
      <Route path="/orders/:id" component={OrderDetailPage} />
      
      {/* Informational Pages */}
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FaqPage} />

      {/* Auth Routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProductsPage} />
      <Route path="/admin/products/new" component={AdminProductForm} />
      <Route path="/admin/products/:id/edit" component={AdminProductForm} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/categories" component={AdminCategoriesPage} />
      <Route path="/admin/customers" component={AdminCustomersPage} />
      <Route path="/admin/inventory" component={AdminInventoryPage} />
      <Route path="/admin/coupons" component={AdminCouponsPage} />
      <Route path="/admin/messages" component={AdminMessagesPage} />
      <Route path="/admin/reports" component={AdminReportsPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;