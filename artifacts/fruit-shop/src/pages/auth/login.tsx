import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLoginUser, useRegisterUser } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const loginMut = useLoginUser();

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
          toast.success(`Welcome back, ${data.user.fullName}!`);
          setLocation('/');
        },
        onError: () => {
          toast.error('Invalid email or password');
        }
      }
    );
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Visual Side */}
      <div className="hidden md:block relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src="/attached_assets/generated_images/cat-fresh-fruits.jpg" 
          alt="Fresh Fruits" 
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => {
            // Fallback pattern if image is missing
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent z-10" />
        <div className="absolute bottom-16 left-12 right-12 z-20 text-primary-foreground">
          <h2 className="text-4xl font-serif font-bold mb-4">Welcome back to ARK PALAMUTHIR NILAYAM</h2>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Sign in to access your orders, saved items, and exclusive member offers on premium fruits.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            ARK PALAMUTHIR NILAYAM
          </span>
        </Link>

        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-serif font-bold mb-2 text-foreground">Sign In</h1>
          <p className="text-muted-foreground mb-8">Enter your email and password to continue.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" type="email" className="h-12 rounded-xl" {...field} />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a href="#" className="text-xs text-primary font-medium hover:underline">Forgot password?</a>
                    </div>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" className="h-12 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-base rounded-xl mt-2" 
                disabled={loginMut.isPending}
              >
                {loginMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Create one now
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/admin/login" className="text-primary font-bold hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
