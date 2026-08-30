import { CustomerLayout } from '@/components/layout/customer-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import { ProductCard } from '@/components/ui/product-card';
import { useGetFeaturedProducts, useListCategories } from '@workspace/api-client-react';

import heroBg from '@assets/generated_images/hero-bg.jpg';
import catFreshFruits from '@assets/generated_images/cat-fresh-fruits.jpg';
import catDryFruits from '@assets/generated_images/cat-dry-fruits.jpg';
import catOrganic from '@assets/generated_images/cat-organic.jpg';
import catImported from '@assets/generated_images/cat-imported.jpg';
import catCombos from '@assets/generated_images/cat-combos.jpg';
import catGiftPacks from '@assets/generated_images/cat-gift-packs.jpg';

const categoryImages: Record<string, string> = {
  'fresh-fruits': catFreshFruits,
  'dry-fruits': catDryFruits,
  'organic': catOrganic,
  'imported': catImported,
  'combos': catCombos,
  'gift-packs': catGiftPacks,
};

export default function HomePage() {
 const { data: featuredProductsData, isLoading: featuredLoading } = useGetFeaturedProducts();

console.log("Featured Products API:", featuredProductsData);

const featuredProducts = Array.isArray(featuredProductsData)
  ? featuredProductsData
  : Array.isArray((featuredProductsData as any)?.data)
    ? (featuredProductsData as any).data
    : [];
  const { data: categoriesData, isLoading: categoriesLoading } = useListCategories();

console.log("Categories API Response:", categoriesData);

const categories = Array.isArray(categoriesData)
  ? categoriesData
  : Array.isArray((categoriesData as any)?.data)
    ? (categoriesData as any).data
    : Array.isArray((categoriesData as any)?.categories)
      ? (categoriesData as any).categories
      : [];

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Premium fruits display" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-background/90 via-black/30 to-black/30" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-foreground backdrop-blur-md border border-primary/30 text-sm font-semibold tracking-wider uppercase mb-4 animate-in slide-in-from-bottom-4 duration-500">
              Farm Fresh Delivery
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-white leading-tight animate-in slide-in-from-bottom-6 duration-700 delay-150">
              Taste the Purest <br/>
              <span className="text-secondary italic">Nature's Bounty</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-700 delay-300">
              Premium, hand-picked fresh fruits and artisanal dry fruits sourced directly from the finest orchards. Delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in slide-in-from-bottom-10 duration-700 delay-500">
              <Link href="/products">
                <Button size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 transition-all">
                  Shop Fresh Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto h-14 px-8 text-lg bg-background/10 text-white border-white/30 backdrop-blur-md hover:bg-background/20 hover:text-white transition-all">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-card border-b py-10 relative z-20 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-6xl rounded-2xl shadow-xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over ₹300" },
              { icon: ShieldCheck, title: "100% Secure", desc: "Safe payment processing" },
              { icon: Leaf, title: "Farm Fresh", desc: "Sourced directly daily" },
              { icon: RefreshCw, title: "Easy Returns", desc: "No questions asked" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 pt-6 md:pt-0 md:px-6 first:pt-0 first:px-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold font-serif">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Explore our curated selection of premium produce and treats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categoriesLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
              ))
            ) : categories?.map((category: any) => (
              <Link key={category.id} href={`/products?category=${category.slug}`} className="group block relative h-72 rounded-2xl overflow-hidden">
                <div className="absolute inset-0">
                  <img 
                    src={categoryImages[category.slug] || category.imageUrl || catFreshFruits} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1 group-hover:text-secondary transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm font-medium">
                    <span>{category.productCount} Products</span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Featured Picks</h2>
              <p className="text-muted-foreground text-lg">Hand-selected items representing the best of our current season.</p>
            </div>
            <Link href="/products?featured=true">
              <Button variant="outline" className="rounded-full">
                View All Featured <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />
              ))
            ) : featuredProducts?.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="grid md:grid-cols-2 items-center relative z-10">
              <div className="p-10 md:p-16 lg:p-20 text-primary-foreground space-y-6">
                <span className="bg-secondary text-secondary-foreground text-sm font-bold uppercase tracking-wider py-1 px-3 rounded-full">Limited Time Offer</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                  Get 20% Off on Your First Organic Basket
                </h2>
                <p className="text-primary-foreground/80 text-lg">
                  Use code <strong className="text-secondary bg-black/10 px-2 py-0.5 rounded">WELCOME20</strong> at checkout to claim your discount on our premium organic selection.
                </p>
                <Link href="/products?organic=true">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-14 px-8 mt-4 font-semibold text-lg">
                    Shop Organic Now
                  </Button>
                </Link>
              </div>
              <div className="h-full min-h-[300px] md:min-h-full bg-cover bg-center" style={{ backgroundImage: `url(${catOrganic})` }}></div>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
