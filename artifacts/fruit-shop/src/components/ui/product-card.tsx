import { Link } from 'wouter';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';
import { Product } from '@workspace/api-client-react';
import {
  useAddToCart,
  useAddToWishlist,
  getGetCartQueryKey,
  getGetWishlistQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';



interface ProductCardProps {
  product: Product;
  className?: string;
}


export function ProductCard({ product, className }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const addToCartMut = useAddToCart();
  const addToWishlistMut = useAddToWishlist();

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    addToCartMut.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetCartQueryKey(),
          });
          toast.success(`${product.name} added to cart`);
        },
        onError: () => {
          toast.error('Failed to add to cart');
        },
      }
    );
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    addToWishlistMut.mutate(
  { productId: product.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetWishlistQueryKey(),
          });
          toast.success('Added to wishlist');
        },
        onError: () => {
          toast.error('Failed to add to wishlist');
        },
      }
    );
  };
    return (
    <Link href={`/products/${product.id}`} className={cn("group block", className)}>
      <div className="bg-card rounded-2xl border border-card-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col relative">

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <Badge className="bg-destructive text-destructive-foreground border-none font-bold">
              {discountPercentage}% OFF
            </Badge>
          )}

          {product.isOrganic && (
            <Badge className="bg-primary text-primary-foreground border-none">
              Organic
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-background transition-colors"
          disabled={addToWishlistMut.isPending}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          <img
            src={product.imageUrl || "https://placehold.co/600x450?text=Fruit"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          <div className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">
            {product.categoryName}
          </div>

          <h3 className="font-serif text-lg font-bold leading-tight mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
                    <div className="mt-auto pt-4 flex items-end justify-between">
            <div>
              {product.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {formatCurrency(product.discountPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-foreground">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <Button
              size="icon"
              className="rounded-full w-10 h-10 shadow-md group-hover:bg-secondary group-hover:text-secondary-foreground transition-all"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || addToCartMut.isPending}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>

          {product.stock <= 0 && (
            <div className="mt-2 text-xs font-semibold text-destructive uppercase tracking-wider">
              Out of stock
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}