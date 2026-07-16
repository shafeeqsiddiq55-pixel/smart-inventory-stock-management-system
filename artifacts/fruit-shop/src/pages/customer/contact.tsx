import { CustomerLayout } from '@/components/layout/customer-layout';
import { useSendContactMessage } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from 'recharts';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendMut = useSendContactMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMut.mutate(
      { data: { name, email, subject, message } },
      {
        onSuccess: () => {
          toast.success('Message sent successfully! We will get back to you soon.');
          setName('');
          setEmail('');
          setSubject('');
          setMessage('');
        },
        onError: () => toast.error('Failed to send message. Please try again later.')
      }
    );
  };

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question about our products, an order, or wholesale pricing? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Our Headquarters</h3>
                  <p className="text-muted-foreground">123 Market Street, Suite 100<br/>San Francisco, CA 94105</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Phone Number</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567<br/>Toll-free: 1-800-NATURA</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email Address</h3>
                  <p className="text-muted-foreground">support@naturafruits.com<br/>wholesale@naturafruits.com</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Working Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 8am - 6pm PST<br/>Saturday: 9am - 2pm PST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-bold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  className="min-h-[150px] resize-none" 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full h-12" disabled={sendMut.isPending}>
                <Send className="w-4 h-4 mr-2" />
                {sendMut.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </CustomerLayout>
  );
}
