
import React from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface TaskFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  open, 
  setOpen, 
  initialData,
  onSubmit 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [cost, setCost] = React.useState(initialData?.cost.toString() || '0');
  const [completed, setCompleted] = React.useState(initialData?.completed || false);

  React.useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCost(initialData.cost.toString());
      setCompleted(initialData.completed);
    } else if (open) {
      // Reset form when opening for a new task
      setTitle('');
      setDescription('');
      setCost('0');
      setCompleted(false);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a task",
        variant: "destructive"
      });
      return;
    }
    
    const numericCost = parseFloat(cost);
    if (isNaN(numericCost) || numericCost < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid cost",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      title,
      description,
      cost: numericCost,
      // For new tasks, use the logged-in user's name
      // For existing tasks, preserve the original assignee
      assignee: initialData ? initialData.assignee : user.name,
      completed
    });
    
    toast({
      title: initialData ? "Task updated" : "Task created",
      description: initialData ? "Your task has been updated" : "Your new task has been created",
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Cost (£)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
            {initialData && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="assignee">Added by</Label>
                <Input
                  id="assignee"
                  value={initialData.assignee}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}
            {initialData && (
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="completed" 
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="completed">Mark as completed</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
