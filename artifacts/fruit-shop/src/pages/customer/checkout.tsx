import { CustomerLayout } from '@/components/layout/customer-layout';
import { useGetCart, useCreateOrder, getGetCartQueryKey } from '@workspace/api-client-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const checkoutSchema = z.object({
  phone: z.string().min(10, 'Valid phone number is required'),
  deliveryAddress: z.string().min(10, 'Please provide a complete delivery address'),
  paymentMethod: z.enum(['cash_on_delivery', 'upi', 'credit_card', 'debit_card']),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { data: cart } = useGetCart();
  const createOrderMut = useCreateOrder();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: user?.phone || '',
      deliveryAddress: user?.address || '',
      paymentMethod: 'cash_on_delivery',
    },
  });

  const onSubmit = (values: CheckoutValues) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    createOrderMut.mutate(
      { 
        data: {
          ...values,
          couponCode: cart.couponCode || undefined
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setIsSuccess(true);
          window.scrollTo(0, 0);
        },
        onError: () => {
          toast.error('Failed to place order. Please try again.');
        }
      }
    );
  };

  if (isSuccess) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-20 min-h-[70vh] flex items-center justify-center">
          <div className="max-w-md w-full bg-card border rounded-3xl p-8 text-center shadow-lg animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for choosing ARK PALAMUTHIR NILAYAM. Your premium fruits are being prepared with care and will be on their way soon.
            </p>
            <div className="space-y-3">
              <Button onClick={() => setLocation('/orders')} className="w-full rounded-xl h-12">
                Track Order
              </Button>
              <Button onClick={() => setLocation('/products')} variant="outline" className="w-full rounded-xl h-12">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Checkout</h1>
          <p className="text-muted-foreground mb-8">You need items in your cart to checkout.</p>
          <Button onClick={() => setLocation('/products')}>Return to Shop</Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Secure Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Shipping Info */}
                <div className="bg-card border rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <Truck className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-serif font-bold">Delivery Information</h2>
                  </div>
                  
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={user?.fullName || ''} disabled className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user?.email || ''} disabled className="bg-muted/50" />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complete Delivery Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="House/Apt No, Street, City, ZIP Code" 
                              className="min-h-[100px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card border rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-serif font-bold">Payment Method</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid sm:grid-cols-2 gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <FormControl>
                                <RadioGroupItem value="credit_card" />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer w-full flex items-center justify-between">
                                Credit Card
                                <CreditCard className="w-5 h-5 text-muted-foreground" />
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem className="flex items-center space-x-3 space-y-0 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <FormControl>
                                <RadioGroupItem value="debit_card" />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer w-full flex items-center justify-between">
                                Debit Card
                                <CreditCard className="w-5 h-5 text-muted-foreground" />
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem className="flex items-center space-x-3 space-y-0 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <FormControl>
                                <RadioGroupItem value="upi" />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer w-full flex items-center justify-between">
                                UPI
                                <span className="font-bold text-xs bg-muted px-2 py-1 rounded">UPI</span>
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-3 space-y-0 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <FormControl>
                                <RadioGroupItem value="cash_on_delivery" />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer w-full flex items-center justify-between">
                                Cash on Delivery
                                <span className="text-muted-foreground text-xs font-semibold">COD</span>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('paymentMethod') !== 'cash_on_delivery' && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground">
                      <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
                      Payment gateway integration would appear here.
                    </div>
                  )}
                </div>

                <div className="hidden lg:block">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg rounded-xl shadow-lg"
                    disabled={createOrderMut.isPending}
                  >
                    {createOrderMut.isPending ? 'Processing...' : `Pay ${formatCurrency(cart.total)}`}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="bg-card border rounded-2xl p-6 sm:p-8 sticky top-24">
            <h3 className="font-serif font-bold text-xl mb-6 border-b pb-4">Order Summary</h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-muted rounded-md shrink-0 overflow-hidden">
                    {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-2">{item.productName}</h4>
                    <div className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} {item.weightOption && `| ${item.weightOption}`}</div>
                    <div className="text-sm font-bold mt-1">{formatCurrency((item.discountPrice || item.price) * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-dashed">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              
              {cart.discount > 0 && (
                <div className="flex justify-between text-primary font-medium text-sm">
                  <span>Discount</span>
                  <span>-{formatCurrency(cart.discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Delivery</span>
                <span>{cart.deliveryCharge === 0 ? 'Free' : formatCurrency(cart.deliveryCharge)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-xl text-foreground pt-3 border-t mt-3">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>

            <div className="lg:hidden mt-8">
              <Button 
                onClick={() => form.handleSubmit(onSubmit)()}
                className="w-full h-14 text-lg rounded-xl shadow-lg"
                disabled={createOrderMut.isPending}
              >
                {createOrderMut.isPending ? 'Processing...' : `Pay ${formatCurrency(cart.total)}`}
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </CustomerLayout>
  );
}
