import { AdminLayout } from '@/components/layout/admin-layout';
import { useAdminListCustomers, useUpdateCustomerStatus, CustomerStatusUpdateStatus } from '@workspace/api-client-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  
  const { data: customers, isLoading } = useAdminListCustomers({
    query: { queryKey: ['adminCustomers', search] },
    params: { search: search || undefined }
  });

  const updateMut = useUpdateCustomerStatus();

  const handleStatusChange = (id: number, status: CustomerStatusUpdateStatus) => {
    updateMut.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
          toast.success('Customer status updated');
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage registered customers and their access.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center">
          <div className="relative w-full sm:max-w-xs">
            <Input 
              placeholder="Search customers by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : customers?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">No customers found.</TableCell></TableRow>
            ) : (
              customers?.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} className={user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select 
                      value={user.status} 
                      onValueChange={(val) => handleStatusChange(user.id, val as CustomerStatusUpdateStatus)}
                      disabled={user.role === 'admin'}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs ml-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
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
