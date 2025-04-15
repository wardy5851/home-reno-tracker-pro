
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <User className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No users yet</h3>
      <p className="mt-2 text-muted-foreground">
        Create your first user to allow them to log in to the system.
      </p>
      <Button className="mt-4" onClick={onCreateClick}>
        Create User
      </Button>
    </div>
  );
};
