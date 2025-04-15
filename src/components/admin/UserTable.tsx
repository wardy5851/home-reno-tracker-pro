
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, Edit, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface UserTableProps {
  users: User[];
  onEditClick: (user: User) => void;
  onDeleteClick: (userId: string) => void;
}

export const UserTable = ({ users, onEditClick, onDeleteClick }: UserTableProps) => {
  return (
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
                  onClick={() => onEditClick(user)}
                  className="mr-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteClick(user.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
