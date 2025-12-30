import React, { useState, useMemo } from 'react';
import { useIssues } from '@/contexts/IssueContext';
import { Status, Priority } from '@/types/issue';
import CreateIssueDialog from './CreateIssueDialog';
import IssueCard from './IssueCard';
import IssueFilters from './IssueFilters';
import { Inbox } from 'lucide-react';

const IssueBoard: React.FC = () => {
  const { issues } = useIssues();
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');

  const filteredIssues = useMemo(() => {
    return issues
      .filter(issue => {
        if (statusFilter !== 'All' && issue.status !== statusFilter) return false;
        if (priorityFilter !== 'All' && issue.priority !== priorityFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [issues, statusFilter, priorityFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Issues</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {issues.length} total • {filteredIssues.length} showing
          </p>
        </div>
        <CreateIssueDialog />
      </div>

      <div className="mb-6 p-4 rounded-lg bg-card/50 border border-border/50">
        <IssueFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
      </div>

      {filteredIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No issues found</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {issues.length === 0 
              ? "You haven't created any issues yet. Click 'Create Issue' to get started."
              : "No issues match your current filters. Try adjusting or clearing them."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredIssues.map((issue, index) => (
            <IssueCard key={issue.id} issue={issue} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueBoard;
