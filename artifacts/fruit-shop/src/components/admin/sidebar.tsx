import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Archive, 
  Ticket, 
  MessageSquare, 
  BarChart, 
  LogOut,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLogoutUser } from '@workspace/api-client-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Tags },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Inventory', path: '/admin/inventory', icon: Archive },
  { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Reports', path: '/admin/reports', icon: BarChart },
];

export function AdminSidebar() {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = useLogoutUser();

  const handleLogout = () => {
    logout();
    setLocation('/admin/login', { replace: true });
    logoutMutation.mutate(undefined, {
      onError: () => undefined,
    });
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r flex flex-col z-40">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground">
        <Link href="/" className="flex items-center gap-2 group w-full">
          <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
          <span className="font-serif text-xl font-bold tracking-tight">
            ARK PALAMUTHIR NILAYAM Admin
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path !== '/admin' && location.startsWith(item.path));
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
