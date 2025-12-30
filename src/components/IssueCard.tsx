import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Issue, Status } from '@/types/issue';
import { useIssues } from '@/contexts/IssueContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { User, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  index: number;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, index }) => {
  const { updateIssueStatus } = useIssues();

  const handleStatusChange = (newStatus: Status) => {
    const result = updateIssueStatus(issue.id, newStatus);
    
    if (!result.success) {
      toast.error('Cannot change status', {
        description: result.message,
        icon: <AlertCircle className="w-4 h-4" />
      });
    } else {
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'Done': return 'status-done';
      default: return '';
    }
  };

  return (
    <Card 
      className={cn(
        "animate-slide-up border-border/50 hover:border-border transition-all duration-200 hover:shadow-lg hover:shadow-primary/5",
        "card-gradient"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', getPriorityClass(issue.priority))}>
                {issue.priority}
              </span>
              <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', getStatusClass(issue.status))}>
                {issue.status}
              </span>
            </div>
            
            <h3 className="font-semibold text-foreground mb-1 truncate">{issue.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{issue.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{issue.assignedTo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{format(new Date(issue.createdAt), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <Select 
              value={issue.status} 
              onValueChange={(v) => handleStatusChange(v as Status)}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[hsl(var(--status-open))]" />
                    Open
                  </span>
                </SelectItem>
                <SelectItem value="In Progress">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[hsl(var(--status-in-progress))]" />
                    In Progress
                  </span>
                </SelectItem>
                <SelectItem value="Done">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[hsl(var(--status-done))]" />
                    Done
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          Created by <span className="text-foreground">{issue.createdBy}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;
