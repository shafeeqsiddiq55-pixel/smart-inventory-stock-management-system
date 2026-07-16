import { AdminLayout } from '@/components/layout/admin-layout';
import { useListCoupons, useCreateCoupon, useDeleteCoupon } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const { data: coupons, isLoading } = useListCoupons();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage'|'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [expiresAt, setExpiresAt] = useState('');

  const queryClient = useQueryClient();
  const createMut = useCreateCoupon();
  const deleteMut = useDeleteCoupon();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate(
      { data: { code: code.toUpperCase(), discountType, discountValue, minOrderAmount, expiresAt: new Date(expiresAt).toISOString() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['useListCoupons'] });
          setIsDialogOpen(false);
          toast.success('Coupon created');
          setCode('');
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    if(confirm('Delete this coupon?')) {
      deleteMut.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['useListCoupons'] });
          toast.success('Coupon deleted');
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Discount Coupons</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Coupon</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Coupon Code</label>
                <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} required placeholder="e.g. SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Type</label>
                  <Select value={discountType} onValueChange={(val: any) => setDiscountType(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Value</label>
                  <Input type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Order Amount ($)</label>
                <Input type="number" value={minOrderAmount} onChange={e => setMinOrderAmount(Number(e.target.value))} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={createMut.isPending}>Create Coupon</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : (
              coupons?.map(coupon => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-bold font-mono">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : formatCurrency(coupon.discountValue)}
                  </TableCell>
                  <TableCell>{formatCurrency(coupon.minOrderAmount)}</TableCell>
                  <TableCell>{new Date(coupon.expiresAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.isActive ? 'default' : 'secondary'} className={coupon.isActive ? 'bg-green-500' : ''}>
                      {coupon.isActive ? 'Active' : 'Expired'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(coupon.id)}><Trash2 className="w-4 h-4" /></Button>
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
