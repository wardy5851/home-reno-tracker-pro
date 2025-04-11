
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Database, SortAsc, SortDesc } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface TaskFiltersProps {
  filter: 'all' | 'completed' | 'pending';
  setFilter: (filter: 'all' | 'completed' | 'pending') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  filter, 
  setFilter, 
  sortOrder, 
  setSortOrder 
}) => {
  return (
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
  );
};

export default TaskFilters;
