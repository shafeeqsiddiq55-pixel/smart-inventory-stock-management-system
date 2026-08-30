import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useAdminLogin } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Leaf, Loader2, ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const loginMut = useAdminLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMut.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          toast.success('Admin access granted');
          setLocation('/admin');
        },
        onError: () => {
          toast.error('Invalid admin credentials or insufficient permissions');
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border shadow-xl rounded-3xl p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground text-sm text-center mt-2">
              Secure area restricted to authorized personnel only.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@ARK PALAMUTHIR NILAYAM.com" type="email" className="h-11 bg-muted/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" className="h-11 bg-muted/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-base mt-4 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground" 
                disabled={loginMut.isPending}
              >
                {loginMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors">
              <Leaf className="w-4 h-4" /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
