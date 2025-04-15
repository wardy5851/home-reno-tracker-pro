import React, { useState, useMemo } from 'react';
import { useTaskStore } from '@/lib/store';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, BarChartIcon, CheckCircle, Plus } from 'lucide-react';

const Dashboard = () => {
  const { tasks } = useTaskStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const chartConfig = {
    created: {
      label: "Created",
      color: "hsl(var(--primary))",
    },
    completed: {
      label: "Completed",
      color: "hsl(142, 76%, 36%)",
    },
  };

  const monthData = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    
    const days = eachDayOfInterval({ start, end });
    
    const dailyData = days.map(day => {
      const dateString = format(day, 'yyyy-MM-dd');
      return {
        date: dateString,
        day: format(day, 'd'),
        created: 0,
        completed: 0,
      };
    });
    
    tasks.forEach(task => {
      const createdDate = new Date(task.createdAt);
      const createdDateString = format(createdDate, 'yyyy-MM-dd');
      
      const createdIndex = dailyData.findIndex(d => d.date === createdDateString);
      if (createdIndex !== -1) {
        dailyData[createdIndex].created += 1;
      }
      
      if (task.completed) {
        const completedIndex = dailyData.findIndex(d => d.date === createdDateString);
        if (completedIndex !== -1) {
          dailyData[completedIndex].completed += 1;
        }
      }
    });
    
    return dailyData;
  }, [tasks, selectedMonth]);
  
  const monthlyStats = useMemo(() => {
    const createdInMonth = monthData.reduce((sum, day) => sum + day.created, 0);
    const completedInMonth = monthData.reduce((sum, day) => sum + day.completed, 0);
    const totalTasksInSystem = tasks.length;
    const totalCompleted = tasks.filter(task => task.completed).length;
    const completionRate = totalTasksInSystem > 0 
      ? Math.round((totalCompleted / totalTasksInSystem) * 100) 
      : 0;
    
    const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);
    const completedCost = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.cost, 0);
    const pendingCost = totalCost - completedCost;
    const monthlyTotalCost = tasks
      .filter(task => {
        const taskDate = new Date(task.createdAt);
        return (
          taskDate >= startOfMonth(selectedMonth) &&
          taskDate <= endOfMonth(selectedMonth)
        );
      })
      .reduce((sum, task) => sum + task.cost, 0);
    
    return {
      createdInMonth,
      completedInMonth,
      totalTasksInSystem,
      totalCompleted,
      completionRate,
      totalCost,
      completedCost,
      pendingCost,
      monthlyTotalCost
    };
  }, [tasks, monthData, selectedMonth]);

  const goToPreviousMonth = () => {
    const prevMonth = new Date(selectedMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedMonth(nextMonth);
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
          <h2 className="text-2xl font-bold">Home Improvement Dashboard</h2>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPreviousMonth} 
              className="px-3 py-1 rounded-md bg-secondary hover:bg-secondary/80"
            >
              ←
            </button>
            <span className="text-lg font-medium">
              {format(selectedMonth, 'MMMM yyyy')}
            </span>
            <button 
              onClick={goToNextMonth} 
              className="px-3 py-1 rounded-md bg-secondary hover:bg-secondary/80"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tasks Created This Month</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {monthlyStats.createdInMonth}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tasks Completed This Month</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                {monthlyStats.completedInMonth}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Monthly Cost Total</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-blue-500" />
                £{monthlyStats.monthlyTotalCost.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall Completion Rate</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-amber-500" />
                {monthlyStats.completionRate}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cost Overview</CardTitle>
            <CardDescription>Summary of all task costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="text-sm font-medium">Total Cost</div>
                <div className="text-2xl font-bold">£{monthlyStats.totalCost.toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/10">
                <div className="text-sm font-medium">Completed Tasks Cost</div>
                <div className="text-2xl font-bold">£{monthlyStats.completedCost.toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10">
                <div className="text-sm font-medium">Pending Tasks Cost</div>
                <div className="text-2xl font-bold">£{monthlyStats.pendingCost.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>Task Activity</CardTitle>
            <CardDescription>
              Daily tasks created and completed in {format(selectedMonth, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ChartContainer 
                config={chartConfig}
                className="h-full w-full"
              >
                <BarChart
                  data={monthData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="created" name="Created" fill="var(--color-created)" />
                  <Bar dataKey="completed" name="Completed" fill="var(--color-completed)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Detailed view of tasks in {format(selectedMonth, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Tasks from {format(selectedMonth, 'MMMM yyyy')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks
                  .filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return (
                      taskDate >= startOfMonth(selectedMonth) &&
                      taskDate <= endOfMonth(selectedMonth)
                    );
                  })
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell>{format(new Date(task.createdAt), 'dd MMM yyyy')}</TableCell>
                      <TableCell>£{task.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.completed 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                {tasks.filter(task => {
                  const taskDate = new Date(task.createdAt);
                  return (
                    taskDate >= startOfMonth(selectedMonth) &&
                    taskDate <= endOfMonth(selectedMonth)
                  );
                }).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No tasks found for this month
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
