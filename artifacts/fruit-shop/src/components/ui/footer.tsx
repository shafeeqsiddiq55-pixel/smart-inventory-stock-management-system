import { Link } from 'wouter';
import { Leaf, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Natura
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium, hand-picked fruits and artisanal dry fruits delivered straight to your door. Experience the finest nature has to offer.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=fresh-fruits" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Fresh Fruits
                </Link>
              </li>
              <li>
                <Link href="/products?category=dry-fruits" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Premium Dry Fruits
                </Link>
              </li>
              <li>
                <Link href="/products?category=organic" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Organic Produce
                </Link>
              </li>
              <li>
                <Link href="/products?category=exotic" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Exotic & Imported
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  FAQ & Shipping
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123 Market Street, Suite 100<br/>San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hello@naturafruits.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Natura Premium Fruits. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Privacy Policy</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
