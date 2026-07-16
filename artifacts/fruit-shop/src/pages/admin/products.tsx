import { AdminLayout } from '@/components/layout/admin-layout';
import { useListProducts, useDeleteProduct } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Star } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useListProducts({
    query: { queryKey: ['adminProducts', search] },
    params: { search: search || undefined, limit: 50 }
  });

  const deleteMut = useDeleteProduct();

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMut.mutate(
      { id: deleteId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
          toast.success('Product deleted successfully');
          setDeleteId(null);
        },
        onError: () => {
          toast.error('Failed to delete product');
          setDeleteId(null);
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your store's inventory and product details.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="shrink-0 gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-xs">
            <Input 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="text-sm text-muted-foreground">
            Total {productsData?.total || 0} products
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="animate-pulse flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/20 animate-bounce" />
                      <div className="w-4 h-4 rounded-full bg-primary/40 animate-bounce delay-100" />
                      <div className="w-4 h-4 rounded-full bg-primary/60 animate-bounce delay-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : productsData?.products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                productsData?.products.map((product) => (
                  <TableRow key={product.id} className="group">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden border">
                        {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="flex gap-2 mt-1">
                        {product.isFeatured && <Badge variant="secondary" className="text-[10px] h-4 px-1.5">Featured</Badge>}
                        {product.isOrganic && <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-primary text-primary">Organic</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/50">{product.categoryName}</Badge>
                    </TableCell>
                    <TableCell>
                      {product.discountPrice ? (
                        <div>
                          <div className="font-bold">{formatCurrency(product.discountPrice)}</div>
                          <div className="text-xs text-muted-foreground line-through">{formatCurrency(product.price)}</div>
                        </div>
                      ) : (
                        <div className="font-bold">{formatCurrency(product.price)}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          product.stock > 20 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span>{product.stock}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.stock > 0 ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="border-none">Out of Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.id}`} className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" /> View in Store
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`} className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" /> Edit Product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(product.id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMut.isPending ? 'Deleting...' : 'Delete Product'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
