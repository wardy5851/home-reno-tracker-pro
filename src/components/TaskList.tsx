
import React, { useState } from 'react';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus, SortAsc, SortDesc, CheckSquare, Database } from 'lucide-react';
import TaskForm from './TaskForm';
import { useTaskStore } from '@/lib/store';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const TaskList: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleCompleted } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (currentTask) {
      updateTask(currentTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setTaskToDelete(id);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Calculate totals
  const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);
  const completedCost = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.cost, 0);
  const pendingCost = totalCost - completedCost;

  return (
    <div className="container mx-auto my-8 px-4">
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
        <Button onClick={handleAddTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="flex items-center gap-1"
        >
          <Database className="h-4 w-4" />
          All Tasks
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
          className="flex items-center gap-1"
        >
          <CheckSquare className="h-4 w-4" />
          Completed
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
          className="flex items-center gap-1"
        >
          <span className="h-4 w-4 border border-current rounded-sm"></span>
          Pending
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 ml-auto">
              {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-10 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No tasks found. Add your first home improvement task!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteConfirm}
              onToggleComplete={toggleCompleted}
            />
          ))}
        </div>
      )}

      <TaskForm
        open={isFormOpen}
        setOpen={setIsFormOpen}
        initialData={currentTask}
        onSubmit={handleSubmitTask}
      />

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskList;
