import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useRegisterUser, useLoginUser } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Leaf, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().min(10, 'Please provide a complete address'),
});

export default function RegisterPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const registerMut = useRegisterUser();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', address: '' },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMut.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          toast.success('Account created successfully!');
          setLocation('/');
        },
        onError: (err: any) => {
          toast.error(err?.data?.error || 'Registration failed');
        }
      }
    );
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Form Side */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 order-2 md:order-1 overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 mb-10 w-fit">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Natura
          </span>
        </Link>

        <div className="w-full max-w-md">
          <h1 className="text-3xl font-serif font-bold mb-2 text-foreground">Create Account</h1>
          <p className="text-muted-foreground mb-8">Join Natura to shop premium fruits and track orders.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" className="h-11 rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="name@email.com" type="email" className="h-11 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input placeholder="(555) 123-4567" className="h-11 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input placeholder="••••••••" type="password" className="h-11 rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl><Textarea placeholder="Full street address, city, zip" className="resize-none rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full h-12 text-base rounded-xl mt-4" disabled={registerMut.isPending}>
                {registerMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:block relative bg-secondary overflow-hidden order-1 md:order-2">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src="/attached_assets/generated_images/cat-dry-fruits.jpg" 
          alt="Premium Dry Fruits" 
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        <div className="absolute bottom-16 left-12 right-12 z-20 text-white">
          <h2 className="text-4xl font-serif font-bold mb-4">Farm to Table</h2>
          <p className="text-white/80 text-lg max-w-md">
            We source our produce directly from trusted farms to ensure the highest quality and freshness for your family.
          </p>
        </div>
      </div>
    </div>
  );
}
