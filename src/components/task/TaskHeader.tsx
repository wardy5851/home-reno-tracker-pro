
import React from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskHeaderProps {
  tasks: Task[];
  onAddTask: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ tasks, onAddTask }) => {
  // Calculate totals
  const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);
  const completedCost = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.cost, 0);
  const pendingCost = totalCost - completedCost;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold">Home Improvement Tasks</h2>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="text-sm px-3 py-1 bg-primary/10 rounded-full">
            Total: £{totalCost.toFixed(2)}
          </div>
          <div className="text-sm px-3 py-1 bg-completed/10 rounded-full">
            Completed: £{completedCost.toFixed(2)}
          </div>
          <div className="text-sm px-3 py-1 bg-pending/10 rounded-full">
            Pending: £{pendingCost.toFixed(2)}
          </div>
        </div>
      </div>
      <Button onClick={onAddTask} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
};

export default TaskHeader;
