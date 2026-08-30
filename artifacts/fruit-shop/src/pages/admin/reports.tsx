import { AdminLayout } from '@/components/layout/admin-layout';
import { useGetSalesChart } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function AdminReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: salesData, isLoading } = useGetSalesChart({
  year,
});

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Sales Reports</h1>
          <p className="text-muted-foreground mt-1">Detailed revenue and performance analytics.</p>
        </div>
        <Select value={year.toString()} onValueChange={(val) => setYear(Number(val))}>
          <SelectTrigger className="w-32 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Monthly Revenue & Orders ({year})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full mt-4">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    formatter={(val: number, name: string) => [name === 'revenue' ? formatCurrency(val) : val, name === 'revenue' ? 'Revenue' : 'Orders']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                  <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Orders Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
