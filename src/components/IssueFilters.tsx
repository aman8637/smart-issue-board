import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Status, Priority } from '@/types/issue';
import { Filter, X } from 'lucide-react';

interface IssueFiltersProps {
  statusFilter: Status | 'All';
  priorityFilter: Priority | 'All';
  onStatusChange: (status: Status | 'All') => void;
  onPriorityChange: (priority: Priority | 'All') => void;
}

const IssueFilters: React.FC<IssueFiltersProps> = ({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}) => {
  const hasFilters = statusFilter !== 'All' || priorityFilter !== 'All';

  const clearFilters = () => {
    onStatusChange('All');
    onPriorityChange('All');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>Filters:</span>
      </div>

      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as Status | 'All')}>
        <SelectTrigger className="w-36 h-9">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Statuses</SelectItem>
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

      <Select value={priorityFilter} onValueChange={(v) => onPriorityChange(v as Priority | 'All')}>
        <SelectTrigger className="w-36 h-9">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Priorities</SelectItem>
          <SelectItem value="Low">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--priority-low))]" />
              Low
            </span>
          </SelectItem>
          <SelectItem value="Medium">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--priority-medium))]" />
              Medium
            </span>
          </SelectItem>
          <SelectItem value="High">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--priority-high))]" />
              High
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
          className="h-9 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default IssueFilters;
