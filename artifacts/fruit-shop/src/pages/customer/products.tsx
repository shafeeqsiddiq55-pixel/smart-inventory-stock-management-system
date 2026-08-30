import { CustomerLayout } from '@/components/layout/customer-layout';
import { useListProducts, useListCategories } from '@workspace/api-client-react';
import { ProductCard } from '@/components/ui/product-card';
import { useLocation, useSearch } from 'wouter';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, Search as SearchIcon, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function ProductsPage() {
  const [location] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const initialCategory = searchParams.get('category');
  const initialSearch = searchParams.get('search') || '';
  const initialOrganic = searchParams.get('organic') === 'true';

  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [organic, setOrganic] = useState(initialOrganic);
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setSearch(initialSearch);
    setPage(1);
  }, [initialSearch]);

  useEffect(() => {
    setOrganic(initialOrganic);
    setPage(1);
  }, [initialOrganic]);

  const { data: categoriesData } = useListCategories();

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray((categoriesData as any)?.data)
      ? (categoriesData as any).data
      : [];

  useEffect(() => {
    if (initialCategory && categories) {
      const cat = categories.find((c: any) => c.slug === initialCategory);
      if (cat) {
        setCategoryId(cat.id);
      }
    }
  }, [initialCategory, categories]);

  const { data: productsResponse, isLoading } = useListProducts({
    page,
    limit: 12,
    categoryId,
    search: search || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 999999 ? priceRange[1] : undefined,
    organic: organic ? true : undefined,
    inStock: inStock ? true : undefined,
    sortBy: sortBy as any,
  });

  const productsData = {
    products: Array.isArray(productsResponse)
      ? productsResponse
      : (productsResponse as any)?.products ??
        (productsResponse as any)?.data ??
        [],
    total:
      (productsResponse as any)?.total ??
      (Array.isArray(productsResponse) ? productsResponse.length : 0),
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryId(undefined);
    setPriceRange([0, 999999]);
    setOrganic(false);
    setInStock(false);
    setSortBy('newest');
    setPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg border-b pb-2">
          Categories
        </h3>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cat-all"
              checked={categoryId === undefined}
              onCheckedChange={() => {
                setCategoryId(undefined);
                setPage(1);
              }}
            />

            <label
              htmlFor="cat-all"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              All Products
            </label>
          </div>

          {categories?.map((cat: any) => (
            <div
              key={cat.id}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`cat-${cat.id}`}
                checked={categoryId === cat.id}
                onCheckedChange={(checked) => {
                  setCategoryId(checked ? cat.id : undefined);
                  setPage(1);
                }}
              />

              <label
                htmlFor={`cat-${cat.id}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
<div className="space-y-4">
  <h3 className="font-serif font-bold text-lg border-b pb-2">
    Price Range
  </h3>

  <div className="space-y-2">
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => {
        setPriceRange([0, 100]);
        setPage(1);
      }}
    >
      ₹0 – ₹100
    </Button>

    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => {
        setPriceRange([101, 400]);
        setPage(1);
      }}
    >
      ₹101 – ₹400
    </Button>

    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => {
        setPriceRange([401, 1000]);
        setPage(1);
      }}
    >
      ₹401 – ₹1000
    </Button>

    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => {
        setPriceRange([1001, 999999]);
        setPage(1);
      }}
    >
      ₹1000+
    </Button>
  </div>
</div>
      {/* Filters */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg border-b pb-2">
          Filters
        </h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-organic"
              checked={organic}
              onCheckedChange={(c) => {
                setOrganic(!!c);
                setPage(1);
              }}
            />

            <label
              htmlFor="filter-organic"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Organic Only
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-instock"
              checked={inStock}
              onCheckedChange={(c) => {
                setInStock(!!c);
                setPage(1);
              }}
            />

            <label
              htmlFor="filter-instock"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        <X className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <CustomerLayout>
      {/* Header */}
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold">
                {categoryId && categories
                  ? categories.find((c: any) => c.id === categoryId)?.name
                  : search
                    ? `Search: ${search}`
                    : 'All Products'}
              </h1>

              <p className="text-muted-foreground mt-2">
                Showing {productsData.products.length} of{' '}
                {productsData.total} products
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 bg-background"
                />

                <SearchIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-40 bg-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="newest">
                      Newest Arrivals
                    </SelectItem>

                    <SelectItem value="price">
                      Price: Low to High
                    </SelectItem>

                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>

                    <SelectItem value="rating">
                      Top Rated
                    </SelectItem>

                    <SelectItem value="bestseller">
                      Best Sellers
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="lg:hidden shrink-0 bg-background"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>

                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[400px] overflow-y-auto"
                  >
                    <SheetHeader className="mb-6">
                      <SheetTitle className="font-serif">
                        Filters
                      </SheetTitle>
                    </SheetHeader>

                    <FilterSidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[400px] rounded-2xl bg-muted animate-pulse"
                  />
                ))}
              </div>

            ) : productsData.products.length === 0 ? (

              <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <SearchIcon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-serif font-bold mb-2">
                  No products found
                </h3>

                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your current
                  filters. Try adjusting your search or clearing some
                  filters.
                </p>

                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>

            ) : (

              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData.products.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-3 mt-8">

                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>

                  <span className="text-sm font-medium">
                    Page {page} of{' '}
                    {Math.ceil(productsData.total / 12)}
                  </span>

                  <Button
                    disabled={
                      page * 12 >= productsData.total
                    }
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>

                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}