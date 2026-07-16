import { CustomerLayout } from '@/components/layout/customer-layout';
import { useGetOrder, useCancelOrder } from '@workspace/api-client-react';
import { useParams, Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { formatCurrency, cn } from '@/lib/utils';
import { ArrowLeft, MapPin, CreditCard, Phone, CheckCircle2, Clock, Truck, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderId = parseInt(id || '0');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useGetOrder(orderId);
  const cancelMut = useCancelOrder();

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelMut.mutate(
        { id: orderId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useGetOrder', orderId] });
            toast.success('Order cancelled successfully');
          },
          onError: () => toast.error('Failed to cancel order')
        }
      );
    }
  };

  if (isLoading || !order) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12 animate-pulse max-w-4xl">
          <div className="h-8 w-32 bg-muted rounded mb-8"></div>
          <div className="h-64 bg-muted rounded-2xl mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-48 bg-muted rounded-2xl"></div>
            <div className="h-48 bg-muted rounded-2xl"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'packed', label: 'Packed', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-6 border-b">
        <div className="container mx-auto px-4 max-w-4xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/orders')} className="rounded-full bg-background border shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Order #{order.id}</h1>
            <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl space-y-8">
        
        {/* Status Timeline */}
        <div className="bg-card border rounded-2xl p-6 sm:p-8">
          <h2 className="font-serif font-bold text-xl mb-6">Order Status</h2>
          
          {isCancelled ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl font-medium border border-destructive/20 text-center">
              This order has been cancelled.
            </div>
          ) : (
            <div className="relative">
              {/* Line */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-muted hidden sm:block z-0"></div>
              <div 
                className="absolute top-5 left-6 h-0.5 bg-primary hidden sm:block z-0 transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
              ></div>

              <div className="flex flex-col sm:flex-row justify-between gap-6 relative z-10">
                {steps.map((step, index) => {
                  const isCompleted = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.key} className="flex sm:flex-col items-center gap-4 sm:gap-2">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors",
                        isCompleted 
                          ? "bg-primary border-primary text-primary-foreground" 
                          : "bg-card border-muted text-muted-foreground",
                        isCurrent && "ring-4 ring-primary/20"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={cn(
                        "text-sm font-medium",
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-card border rounded-2xl p-6 sm:p-8">
            <h2 className="font-serif font-bold text-xl mb-6 border-b pb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">{order.customerName || 'Customer'}</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">{order.deliveryAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="text-sm">{order.phone}</div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="text-sm uppercase tracking-wider font-medium">{order.paymentMethod.replace(/_/g, ' ')}</div>
              </div>
            </div>
          </div>

          {/* Items & Summary */}
          <div className="bg-card border rounded-2xl p-6 sm:p-8">
            <h2 className="font-serif font-bold text-xl mb-6 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-muted rounded-md shrink-0 overflow-hidden">
                    {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`} className="text-sm font-medium hover:text-primary truncate block">
                      {item.productName}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity} {item.weightOption && `| ${item.weightOption}`}</div>
                  </div>
                  <div className="text-sm font-bold shrink-0">{formatCurrency(item.subtotal)}</div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-dashed">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-primary font-medium text-sm">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Delivery</span>
                <span>{order.deliveryCharge === 0 ? 'Free' : formatCurrency(order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-foreground pt-3 border-t mt-3">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            {order.status === 'pending' && (
              <div className="mt-8">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleCancel}
                  disabled={cancelMut.isPending}
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
