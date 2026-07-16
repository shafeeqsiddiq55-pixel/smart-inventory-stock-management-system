import { CustomerLayout } from '@/components/layout/customer-layout';
import { useListCategories } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { ArrowRight, Leaf } from 'lucide-react';
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

export default function CategoriesPage() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Shop by Category</h1>
          <p className="text-muted-foreground text-lg">
            Explore our wide selection of premium fresh fruits, artisanal dry fruits, and curated organic produce.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />
            ))
          ) : (
            categories?.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`} className="group block relative h-80 rounded-3xl overflow-hidden shadow-md">
                <div className="absolute inset-0">
                  <img 
                    src={categoryImages[category.slug] || category.imageUrl || catFreshFruits} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-serif font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center text-secondary font-medium">
                    <span>View {category.productCount} Products</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
