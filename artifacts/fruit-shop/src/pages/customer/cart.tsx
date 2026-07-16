import { CustomerLayout } from '@/components/layout/customer-layout';
import { useGetCart, useUpdateCartItem, useRemoveCartItem, useApplyCoupon, getGetCartQueryKey } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { Link } from 'wouter';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function CartPage() {
  const { data: cart, isLoading } = useGetCart();
  const updateItemMut = useUpdateCartItem();
  const removeItemMut = useRemoveCartItem();
  const applyCouponMut = useApplyCoupon();
  const queryClient = useQueryClient();
  
  const [couponCode, setCouponCode] = useState('');

  const handleUpdateQuantity = (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    updateItemMut.mutate(
      { itemId, data: { quantity: newQty } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        }
      }
    );
  };

  const handleRemove = (itemId: number) => {
    removeItemMut.mutate(
      { itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success('Item removed from cart');
        }
      }
    );
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    applyCouponMut.mutate(
      { data: { code: couponCode } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success('Coupon applied successfully');
        },
        onError: () => {
          toast.error('Invalid or expired coupon');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Your Shopping Cart</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {isEmpty ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any premium fruits to your cart yet. Discover our fresh selection!
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-card rounded-2xl border p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center relative transition-shadow hover:shadow-md">
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                    disabled={removeItemMut.isPending}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-muted shrink-0 overflow-hidden">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`} className="font-serif font-bold text-lg hover:text-primary transition-colors line-clamp-1 pr-8">
                      {item.productName}
                    </Link>
                    {item.weightOption && (
                      <div className="text-sm text-muted-foreground mb-2">Size: {item.weightOption}</div>
                    )}
                    
                    <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                      <div className="flex items-center border rounded-lg bg-background h-10 w-fit">
                        <button 
                          className="px-3 hover:bg-muted h-full rounded-l-lg transition-colors"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updateItemMut.isPending}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-10 text-center font-medium">{item.quantity}</div>
                        <button 
                          className="px-3 hover:bg-muted h-full rounded-r-lg transition-colors"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updateItemMut.isPending}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        {item.discountPrice ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-foreground">{formatCurrency(item.discountPrice * item.quantity)}</span>
                            <span className="text-xs text-muted-foreground line-through">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-lg text-foreground">{formatCurrency(item.price * item.quantity)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="bg-card border rounded-2xl p-6 sm:p-8 sticky top-24">
              <h3 className="font-serif font-bold text-xl mb-6 border-b pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                
                {cart.discount > 0 && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>Discount {cart.couponCode && `(${cart.couponCode})`}</span>
                    <span>-{formatCurrency(cart.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-muted-foreground border-b pb-4">
                  <span>Delivery Charge</span>
                  <span>{cart.deliveryCharge === 0 ? 'Free' : formatCurrency(cart.deliveryCharge)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-xl text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
              </div>
              
              <form onSubmit={handleApplyCoupon} className="mb-8 relative">
                <Input 
                  placeholder="Enter coupon code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="pr-20"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1 top-1 bottom-1 h-auto px-4"
                  disabled={applyCouponMut.isPending || !couponCode}
                >
                  Apply
                </Button>
              </form>
              
              <Link href="/checkout">
                <Button className="w-full h-14 text-lg rounded-xl shadow-lg">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
