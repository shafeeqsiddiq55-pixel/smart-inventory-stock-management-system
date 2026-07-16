import { AdminLayout } from '@/components/layout/admin-layout';
import { useGetInventory, useUpdateStock } from '@workspace/api-client-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Edit2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminInventoryPage() {
  const { data: inventory, isLoading } = useGetInventory();
  const updateMut = useUpdateStock();
  const queryClient = useQueryClient();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const startEdit = (id: number, currentStock: number) => {
    setEditingId(id);
    setEditValue(currentStock);
  };

  const saveEdit = (id: number) => {
    updateMut.mutate({ productId: id, data: { stock: editValue } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['useGetInventory'] });
        toast.success('Stock updated');
        setEditingId(null);
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Inventory Levels</h1>
        <p className="text-muted-foreground mt-1">Monitor and quickly adjust stock counts.</p>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[200px]">Current Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : (
              inventory?.map(item => (
                <TableRow key={item.productId} className={item.status === 'out_of_stock' ? 'bg-red-50/50 dark:bg-red-950/20' : ''}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.categoryName}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        item.status === 'in_stock' ? 'bg-green-500' : 
                        item.status === 'low_stock' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs uppercase font-medium">{item.status.replace(/_/g, ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingId === item.productId ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                          className="w-20 h-8"
                        />
                        <Button size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700" onClick={() => saveEdit(item.productId)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 group">
                        <span className="text-lg font-semibold w-12">{item.stock}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEdit(item.productId, item.stock)}>
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
