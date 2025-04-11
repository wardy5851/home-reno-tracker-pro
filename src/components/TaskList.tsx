
import React, { useState } from 'react';
import { Task } from '@/types/task';
import TaskForm from './TaskForm';
import { useTaskStore } from '@/lib/store';
import TaskHeader from './task/TaskHeader';
import TaskFilters from './task/TaskFilters';
import TaskGrid from './task/TaskGrid';
import DeleteConfirmation from './task/DeleteConfirmation';

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

  return (
    <div className="container mx-auto my-8 px-4">
      <TaskHeader tasks={tasks} onAddTask={handleAddTask} />
      
      <TaskFilters 
        filter={filter}
        setFilter={setFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <TaskGrid 
        tasks={sortedTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteConfirm}
        onToggleComplete={toggleCompleted}
      />

      <TaskForm
        open={isFormOpen}
        setOpen={setIsFormOpen}
        initialData={currentTask}
        onSubmit={handleSubmitTask}
      />

      <DeleteConfirmation 
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
};

export default TaskList;
