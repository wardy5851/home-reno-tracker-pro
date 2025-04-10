
import React from 'react';
import { Task } from '@/types/task';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Check, Pencil, Trash2, PoundSterling } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  onToggleComplete,
}) => {
  return (
    <Card className={cn(
      "task-card border-l-4",
      task.completed ? "border-l-completed" : "border-l-pending"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className={cn(
            "font-medium text-lg",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          <Badge 
            className={cn(
              "ml-2", 
              task.completed ? "bg-completed text-completed-foreground" : "bg-pending text-pending-foreground"
            )}
          >
            {task.completed ? 'Completed' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <PoundSterling className="h-3 w-3" />
            {task.cost.toFixed(2)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Added by: {task.assignee}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onToggleComplete(task.id)}
          title={task.completed ? "Mark as pending" : "Mark as completed"}
        >
          <Check className={cn(
            "h-4 w-4",
            task.completed && "text-completed"
          )} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onDelete(task.id)}
          className="hover:bg-destructive hover:text-destructive-foreground"
          title="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
