
import React from 'react';
import { Task } from '@/types/task';
import TaskCard from '../TaskCard';

interface TaskGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No tasks found. Add your first home improvement task!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
