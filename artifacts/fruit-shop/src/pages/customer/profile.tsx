import { CustomerLayout } from '@/components/layout/customer-layout';
import { useAuth } from '@/hooks/use-auth';
import { useUpdateProfile, useChangePassword, useGetCurrentUser } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, Shield, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const updateProfileMut = useUpdateProfile();
  const changePasswordMut = useChangePassword();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMut.mutate(
      { data: { fullName, phone, address } },
      {
        onSuccess: (data) => {
          updateUser(data);
          toast.success('Profile updated successfully');
        },
        onError: () => toast.error('Failed to update profile')
      }
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    changePasswordMut.mutate(
      { data: { currentPassword, newPassword } },
      {
        onSuccess: () => {
          toast.success('Password changed successfully');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (err: any) => toast.error(err?.data?.error || 'Failed to change password')
      }
    );
  };

  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">My Account</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
            <TabsTrigger value="profile"><UserCircle className="w-4 h-4 mr-2" /> Personal Info</TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" /> Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="bg-card border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-serif font-bold mb-6 border-b pb-4">Personal Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label>Email Address (Read Only)</Label>
                  <Input value={user?.email || ''} disabled className="bg-muted" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea 
                    id="address" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    className="min-h-[100px] resize-none"
                    required 
                  />
                </div>
                
                <Button type="submit" disabled={updateProfileMut.isPending} className="w-full sm:w-auto px-8">
                  {updateProfileMut.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="bg-card border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-serif font-bold mb-6 border-b pb-4">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={changePasswordMut.isPending} className="w-full">
                  {changePasswordMut.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
}
