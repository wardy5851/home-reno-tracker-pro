import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, UserPlus, X, CheckCircle, Shield, Edit } from 'lucide-react';

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  isAdmin: z.boolean().default(false),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface AppUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isAdmin: false,
    },
  });

  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      isAdmin: false,
    },
  });

  useEffect(() => {
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('app_users', JSON.stringify(users));
    }
  }, [users]);

  const handleCreateUser = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (users.some(u => u.email === values.email)) {
        toast({
          title: 'User creation failed',
          description: 'A user with this email already exists',
          variant: 'destructive'
        });
        return;
      }

      const newUser: AppUser = {
        id: Date.now().toString(),
        name: values.name,
        email: values.email,
        isAdmin: values.isAdmin,
      };

      const credentials = {
        email: values.email,
        password: values.password,
      };

      const storedCredentials = localStorage.getItem('app_credentials') || '{}';
      const credentialsObj = JSON.parse(storedCredentials);
      credentialsObj[values.email] = values.password;
      localStorage.setItem('app_credentials', JSON.stringify(credentialsObj));

      setUsers(prevUsers => [...prevUsers, newUser]);

      toast({
        title: 'User created successfully',
        description: `${values.name} has been added to the system`,
      });

      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error creating user',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (!selectedUser) return;

      if (values.email !== selectedUser.email && users.some(u => u.email === values.email)) {
        toast({
          title: "User update failed",
          description: "A user with this email already exists",
          variant: "destructive"
        });
        return;
      }

      const updatedUsers = users.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            name: values.name,
            email: values.email,
            isAdmin: values.isAdmin,
          };
        }
        return u;
      });

      if (values.password) {
        const storedCredentials = localStorage.getItem('app_credentials') || '{}';
        const credentialsObj = JSON.parse(storedCredentials);
        credentialsObj[values.email] = values.password;
        localStorage.setItem('app_credentials', JSON.stringify(credentialsObj));
      }

      setUsers(updatedUsers);
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));

      toast({
        title: "User updated successfully",
        description: `${values.name}'s details have been updated`,
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      editForm.reset();
    } catch (error) {
      toast({
        title: "Error updating user",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    if (updatedUsers.length === 0) {
      localStorage.removeItem('app_users');
    } else {
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    }
    
    const storedCredentials = localStorage.getItem('app_credentials') || '{}';
    const credentialsObj = JSON.parse(storedCredentials);
    delete credentialsObj[userToDelete.email];
    localStorage.setItem('app_credentials', JSON.stringify(credentialsObj));

    toast({
      title: 'User deleted',
      description: `${userToDelete.name} has been removed from the system`,
    });
  };

  const handleEditClick = (userToEdit: AppUser) => {
    setSelectedUser(userToEdit);
    editForm.reset({
      name: userToEdit.name,
      email: userToEdit.email,
      isAdmin: userToEdit.isAdmin,
      password: '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Administration</h1>
            <p className="text-muted-foreground">Manage users who can access the system</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No users yet</h3>
            <p className="mt-2 text-muted-foreground">
              Create your first user to allow them to log in to the system.
            </p>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              Create User
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isAdmin ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.isAdmin && <Shield className="mr-1 h-3 w-3" />}
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user who can log in to the system.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
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
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Admin Access</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Grant this user administrative privileges
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Modify user details. Leave password blank to keep current password.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password (optional)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Leave blank to keep current" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Admin Access</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Grant this user administrative privileges
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminPage;
