import { CustomerLayout } from '@/components/layout/customer-layout';
import { useGetProduct, useGetRelatedProducts, useListProductReviews, useAddToCart, useAddToWishlist, getGetCartQueryKey } from '@workspace/api-client-react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Minus, Plus, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ui/product-card';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id || '0');
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string>('');

  const { data: product, isLoading } = useGetProduct(productId);
  const { data: relatedProducts } = useGetRelatedProducts(productId);
  const { data: reviews } = useListProductReviews(productId);
  
  const addToCartMut = useAddToCart();
  const addToWishlistMut = useAddToWishlist();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    
    if (weightOptions.length > 0 && !selectedWeight) {
      toast.error('Please select a weight option');
      return;
    }

    addToCartMut.mutate(
      { data: { productId, quantity, weightOption: selectedWeight || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success('Added to cart successfully');
        }
      }
    );
  };

  if (isLoading || !product) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12 animate-pulse">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-muted aspect-square rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-10 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const weightOptions = product.weightOptions ? product.weightOptions.split(',').map(w => w.trim()) : [];
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <CustomerLayout>
      {/* Breadcrumb - simple text for now */}
      <div className="bg-muted/30 py-4 border-b">
        <div className="container mx-auto px-4 text-sm text-muted-foreground">
          Home / {product.categoryName} / <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-muted aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden relative border border-border">
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground border-none font-bold text-sm px-3 py-1">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.isOrganic && (
                <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground border-none text-sm px-3 py-1" style={{ marginTop: discountPercentage > 0 ? '40px' : '0' }}>
                  Organic
                </Badge>
              )}
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-primary font-medium tracking-wider uppercase text-sm mb-2">
              {product.categoryName}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-5 h-5", i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground/30")} />
                  ))}
                </div>
                <span className="ml-2 font-medium">{product.rating.toFixed(1)}</span>
                <span className="ml-1 text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <div className="text-muted-foreground">|</div>
              <div className={cn("font-medium", product.stock > 0 ? "text-green-600" : "text-destructive")}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </div>
            </div>

            <div className="mb-6">
              {product.discountPrice ? (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-foreground">
                    {formatCurrency(product.discountPrice)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through mb-1">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-foreground">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Weight Options */}
            {weightOptions.length > 0 && (
              <div className="mb-8">
                <h3 className="font-medium mb-3">Select Weight/Size:</h3>
                <div className="flex flex-wrap gap-3">
                  {weightOptions.map(weight => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={cn(
                        "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                        selectedWeight === weight 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-input rounded-xl bg-background w-fit h-14">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-l-xl h-full w-12 hover:bg-muted"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-12 text-center font-semibold text-lg">{quantity}</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-r-xl h-full w-12 hover:bg-muted"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <Button 
                className="h-14 flex-1 rounded-xl text-lg font-semibold"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addToCartMut.isPending}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-xl shrink-0 border-border hover:text-destructive hover:bg-destructive/10"
                onClick={() => addToWishlistMut.mutate({ data: { productId } })}
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-8 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium leading-tight">Premium<br/>Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium leading-tight">Fast<br/>Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium leading-tight">Freshness<br/>Guarantee</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-20">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto bg-transparent p-0 gap-8">
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-serif data-[state=active]:shadow-none"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger 
                value="nutrition" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-serif data-[state=active]:shadow-none"
              >
                Nutrition & Health
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-serif data-[state=active]:shadow-none"
              >
                Reviews ({reviews?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <div className="py-8 bg-card rounded-b-2xl rounded-tr-2xl p-6 md:p-8 mt-2 border shadow-sm">
              <TabsContent value="details" className="mt-0 outline-none text-muted-foreground leading-relaxed">
                {product.description || 'No detailed description available for this product.'}
              </TabsContent>
              
              <TabsContent value="nutrition" className="mt-0 outline-none">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-foreground mb-4">Nutritional Information</h3>
                    <div className="prose prose-sm dark:prose-invert">
                      {product.nutritionInfo ? (
                        <p className="whitespace-pre-wrap">{product.nutritionInfo}</p>
                      ) : (
                        <p className="text-muted-foreground italic">No nutritional information provided.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-foreground mb-4">Health Benefits</h3>
                    <div className="prose prose-sm dark:prose-invert">
                      {product.healthBenefits ? (
                        <p className="whitespace-pre-wrap">{product.healthBenefits}</p>
                      ) : (
                        <p className="text-muted-foreground italic">No health benefits information provided.</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0 outline-none">
                <div className="space-y-8">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-foreground">{review.userName}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-amber-400 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-muted-foreground/30")} />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
