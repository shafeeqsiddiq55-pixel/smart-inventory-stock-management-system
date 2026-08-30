  import { Link, useLocation } from 'wouter';
  import { useAuth } from '@/hooks/use-auth';
  import { useGetCart, useGetWishlist } from '@workspace/api-client-react';
  import { ShoppingCart, Heart, User as UserIcon, Menu, X, Leaf, Moon, Sun, Search, LogOut } from 'lucide-react';
  import { useState, useEffect } from 'react';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
  import { useTheme } from 'next-themes';
  import { Badge } from '@/components/ui/badge';
  import { cn } from '@/lib/utils';
  import { useLogoutUser } from '@workspace/api-client-react';

  export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { data: cart } = useGetCart();

    const { data: wishlist } = useGetWishlist();
    
    const logoutMutation = useLogoutUser();

    const handleLogout = () => {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          logout();
          setLocation('/');
        }
      });
    };

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
        setMobileMenuOpen(false);
      }
    };

    const navLinks = [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'Categories', path: '/categories' },
      { name: 'Fruit Assistant', path: '/fruit-assistant' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ];

    return (
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
          isScrolled 
            ? "bg-background/95 backdrop-blur-md shadow-sm border-border" 
            : "bg-background border-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                ARK PALAMUTHIR NILAYAM
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left",
                    location === link.path ? "text-primary after:scale-x-100" : "text-foreground/80"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
                <Input 
                  type="search" 
                  placeholder="Search products..." 
                  className="w-48 xl:w-64 pl-9 rounded-full bg-muted/50 border-transparent focus-visible:bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Dark mode toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hidden sm:flex"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {isAuthenticated ? (
                <>
                  <Link href="/wishlist">
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                      <Heart className="w-5 h-5" />
                      {wishlist && wishlist.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                          {wishlist.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cart && cart.items.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                        {cart.items.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                      <UserIcon className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      Hello, {user?.fullName}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full flex items-center">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer w-full flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer w-full flex items-center text-primary font-medium">
                          <Leaf className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full">Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background shadow-lg absolute top-full left-0 right-0 animate-in slide-in-from-top-2">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center relative">
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
            
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    location === link.path ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>

            {!isAuthenticated && (
              <div className="pt-4 border-t flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
