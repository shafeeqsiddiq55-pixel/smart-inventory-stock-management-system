import { AdminLayout } from '@/components/layout/admin-layout';
import { useAdminListMessages, useAdminDeleteMessage } from '@workspace/api-client-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminMessagesPage() {
  const { data: messages, isLoading } = useAdminListMessages();
  const deleteMut = useAdminDeleteMessage();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if(confirm('Delete this message?')) {
      deleteMut.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['useAdminListMessages'] });
          toast.success('Message deleted');
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Contact Messages</h1>
        <p className="text-muted-foreground mt-1">Inquiries and messages from customers.</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-2xl text-muted-foreground">No messages yet.</div>
        ) : (
          messages?.map(msg => (
            <Card key={msg.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{msg.name}</h3>
                    <p className="text-sm text-muted-foreground">{msg.email} • {new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(msg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border">
                <h4 className="font-semibold mb-2">Subject: {msg.subject}</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
