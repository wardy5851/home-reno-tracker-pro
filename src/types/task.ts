
export interface Task {
  id: string;
  title: string;
  description: string;
  cost: number;
  assignee: string;
  completed: boolean;
  createdAt: Date;
}
