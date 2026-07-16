import { AdminLayout } from '@/components/layout/admin-layout';
import { useCreateProduct, useUpdateProduct, useGetProduct, useListCategories } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useLocation, useParams } from 'wouter';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  categoryId: z.coerce.number().min(1, 'Category is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  discountPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isOrganic: z.boolean().default(false),
  weightOptions: z.string().optional(),
  nutritionInfo: z.string().optional(),
  healthBenefits: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProductForm() {
  const params = useParams();
  const isEdit = !!params.id;
  const productId = parseInt(params.id || '0');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: categories } = useListCategories();
  const { data: product, isLoading: productLoading } = useGetProduct(productId, { 
    query: { enabled: isEdit } 
  });

  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: 0,
      description: '',
      price: 0,
      discountPrice: null,
      stock: 0,
      imageUrl: '',
      isFeatured: false,
      isOrganic: false,
      weightOptions: '',
      nutritionInfo: '',
      healthBenefits: '',
    },
  });

  useEffect(() => {
    if (isEdit && product) {
      form.reset({
        name: product.name,
        categoryId: product.categoryId,
        description: product.description || '',
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        isFeatured: product.isFeatured,
        isOrganic: product.isOrganic,
        weightOptions: product.weightOptions || '',
        nutritionInfo: product.nutritionInfo || '',
        healthBenefits: product.healthBenefits || '',
      });
    }
  }, [isEdit, product, form]);

  const onSubmit = (values: ProductFormValues) => {
    // Clean up empty strings to undefined
    const cleanValues = {
      ...values,
      imageUrl: values.imageUrl || undefined,
      description: values.description || undefined,
      weightOptions: values.weightOptions || undefined,
      nutritionInfo: values.nutritionInfo || undefined,
      healthBenefits: values.healthBenefits || undefined,
      discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
    };

    if (isEdit) {
      updateMut.mutate(
        { id: productId, data: cleanValues },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
            toast.success('Product updated successfully');
            setLocation('/admin/products');
          },
          onError: () => toast.error('Failed to update product')
        }
      );
    } else {
      createMut.mutate(
        { data: cleanValues as any },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
            toast.success('Product created successfully');
            setLocation('/admin/products');
          },
          onError: () => toast.error('Failed to create product')
        }
      );
    }
  };

  const isPending = createMut.isPending || updateMut.isPending;

  if (isEdit && productLoading) {
    return <AdminLayout><div className="p-8 text-center">Loading product data...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/products')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? 'Update product details and inventory.' : 'Create a new product listing in your store.'}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                  <h2 className="text-lg font-serif font-bold border-b pb-2">Basic Information</h2>
                  
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Premium Alphonso Mangoes" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the product..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regular Price ($)</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="discountPrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price ($) - Optional</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                  <h2 className="text-lg font-serif font-bold border-b pb-2">Additional Details</h2>
                  
                  <FormField control={form.control} name="weightOptions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight/Size Options</FormLabel>
                      <FormControl><Input placeholder="e.g. 500g, 1kg, 2kg (comma separated)" {...field} /></FormControl>
                      <FormDescription>Comma separated list of options for the user to choose from</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="nutritionInfo" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nutritional Info</FormLabel>
                      <FormControl><Textarea placeholder="Calories: 50, Sugar: 10g..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="healthBenefits" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Benefits</FormLabel>
                      <FormControl><Textarea placeholder="Rich in Vitamin C, boosts immunity..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                  <h2 className="text-lg font-serif font-bold border-b pb-2">Organization</h2>
                  
                  <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(Number(val))} 
                        value={field.value ? field.value.toString() : ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Stock</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                  <h2 className="text-lg font-serif font-bold border-b pb-2">Media</h2>
                  
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                      {field.value && (
                        <div className="mt-4 aspect-square rounded-lg border overflow-hidden bg-muted">
                          <img src={field.value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        </div>
                      )}
                    </FormItem>
                  )} />
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                  <h2 className="text-lg font-serif font-bold border-b pb-2">Tags</h2>
                  
                  <FormField control={form.control} name="isFeatured" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Featured</FormLabel>
                        <FormDescription>Show on homepage</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="isOrganic" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Organic</FormLabel>
                        <FormDescription>Mark as organic</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-6">
              <Button type="button" variant="outline" onClick={() => setLocation('/admin/products')}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="px-8 gap-2">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEdit ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
            
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
