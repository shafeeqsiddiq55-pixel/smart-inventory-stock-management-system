import { CustomerLayout } from '@/components/layout/customer-layout';
import { useAuth } from '@/hooks/use-auth';
import { useListOrders } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'wouter';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';

export default function CustomerOrdersPage() {
  const { isAuthenticated } = useAuth();
  const { data: ordersData, isLoading } = useListOrders();
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return <Truck className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">My Orders</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {isLoading ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : !ordersData || ordersData.length === 0? (
          <div className="text-center py-20 max-w-md mx-auto border rounded-3xl bg-card">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Package className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              When you place an order, it will appear here so you can track its status.
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {ordersData.map((order: any) => (
              <div key={order.id} className="bg-card border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-background p-3 rounded-full border shadow-sm">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="font-bold text-lg">Order #{order.id}</div>
                      <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total Amount</div>
                      <div className="font-bold text-lg">{formatCurrency(order.total)}</div>
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full h-9">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="bg-muted px-3 py-1 text-sm font-medium">
                      Status: <span className="ml-1 text-foreground">{formatStatus(order.status)}</span>
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {order.items.slice(0, 4).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-muted/30 p-2 pr-4 rounded-xl border">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                          {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium line-clamp-1 max-w-[120px]">{item.productName}</div>
                          <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex items-center justify-center bg-muted/30 w-12 rounded-xl border text-sm font-medium text-muted-foreground">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
