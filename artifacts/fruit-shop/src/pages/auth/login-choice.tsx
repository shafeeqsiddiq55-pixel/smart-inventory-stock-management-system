import { Link } from 'wouter';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginChoicePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-3">
            Please select how you would like to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <User className="w-10 h-10 text-primary mb-5" />

            <h2 className="text-2xl font-serif font-bold mb-3">
              Customer
            </h2>

            <p className="text-muted-foreground mb-6">
              Browse fresh fruits and dry fruits, manage your cart,
              wishlist, orders, and enjoy a convenient shopping experience.
            </p>

            <Link
              href="/customer-login"
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-medium"
            >
              Continue as Customer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin */}
          <div className="border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <ShieldCheck className="w-10 h-10 text-primary mb-5" />

            <h2 className="text-2xl font-serif font-bold mb-3">
              Admin
            </h2>

            <p className="text-muted-foreground mb-6">
              Manage products, inventory, orders, customers, coupons,
              messages, and business reports.
            </p>

            <Link
              href="/admin/login"
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-medium"
            >
              Continue as Admin
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}