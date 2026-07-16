import { CustomerLayout } from '@/components/layout/customer-layout';
import { useGetWishlist, useRemoveFromWishlist, useMoveWishlistToCart, getGetWishlistQueryKey, getGetCartQueryKey } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useGetWishlist();
  const removeMut = useRemoveFromWishlist();
  const moveMut = useMoveWishlistToCart();
  const queryClient = useQueryClient();

  const handleRemove = (productId: number) => {
    removeMut.mutate(
      { productId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          toast.success('Removed from wishlist');
        }
      }
    );
  };

  const handleMoveToCart = (productId: number) => {
    moveMut.mutate(
      { productId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success('Moved to cart');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12 animate-pulse">
          <div className="h-10 w-48 bg-muted rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] bg-muted rounded-2xl"></div>
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const isEmpty = !wishlist || wishlist.length === 0;

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">My Wishlist</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {isEmpty ? (
          <div className="text-center py-20 max-w-md mx-auto border rounded-3xl bg-card">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Heart className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Save your favorite products here and easily add them to your cart later.
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                Discover Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-card border rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-all">
                <div className="aspect-[4/3] bg-muted relative">
                  {item.discountPrice && (
                    <Badge className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground border-none font-bold">
                      Sale
                    </Badge>
                  )}
                  <button 
                    onClick={() => handleRemove(item.productId)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-background transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-serif font-bold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                      {item.productName}
                    </h3>
                  </Link>
                  
                  <div className="mb-4">
                    {item.discountPrice ? (
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-foreground">{formatCurrency(item.discountPrice)}</span>
                        <span className="text-sm text-muted-foreground line-through mb-0.5">{formatCurrency(item.price)}</span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-foreground">{formatCurrency(item.price)}</span>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    {item.stock > 0 ? (
                      <Button 
                        className="w-full rounded-xl" 
                        onClick={() => handleMoveToCart(item.productId)}
                        disabled={moveMut.isPending}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Move to Cart
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-full rounded-xl" disabled>
                        Out of Stock
                      </Button>
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
