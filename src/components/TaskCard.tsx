
import React from 'react';
import { Task } from '@/types/task';
import { formatDistanceToNow } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, Check, X } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete,
  onToggleComplete
}) => {
  const formattedDate = formatDistanceToNow(
    new Date(task.createdAt),
    { addSuffix: true }
  );

  return (
    <Card className={`overflow-hidden ${task.completed ? 'bg-muted/30' : ''}`}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start space-y-0">
        <div>
          <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </CardTitle>
          <div className="flex items-center mt-1">
            <span className="text-xs text-muted-foreground">
              Added by {task.assignee} • {formattedDate}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleComplete(task.id)}>
              {task.completed ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Mark as incomplete
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Mark as complete
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <p className={`text-sm ${task.completed ? 'text-muted-foreground' : ''}`}>
          {task.description || 'No description provided.'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${task.completed ? 'text-muted-foreground' : ''}`}>
            £{task.cost.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center">
          {task.completed ? (
            <span className="text-xs px-2 py-1 bg-completed/20 text-completed/80 rounded-full">
              Completed
            </span>
          ) : (
            <span className="text-xs px-2 py-1 bg-pending/20 text-pending/80 rounded-full">
              Pending
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
