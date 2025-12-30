import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIssues } from '@/contexts/IssueContext';
import { useAuth } from '@/contexts/AuthContext';
import { Priority, Issue } from '@/types/issue';
import { toast } from 'sonner';
import { Plus, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const CreateIssueDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [similarIssues, setSimilarIssues] = useState<Issue[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);

  const { addIssue, findSimilarIssues } = useIssues();
  const { user } = useAuth();

  useEffect(() => {
    if (title.length > 3 || description.length > 10) {
      const similar = findSimilarIssues(title, description);
      setSimilarIssues(similar);
      setShowSimilar(similar.length > 0);
      setConfirmCreate(false);
    } else {
      setSimilarIssues([]);
      setShowSimilar(false);
    }
  }, [title, description, findSimilarIssues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (similarIssues.length > 0 && !confirmCreate) {
      toast.info('Similar issues found! Please review them before proceeding.', {
        description: 'Click "Create Anyway" to proceed.'
      });
      return;
    }

    if (!user) return;

    addIssue({
      title,
      description,
      priority,
      assignedTo: assignedTo || user.email
    }, user.email);

    toast.success('Issue created successfully!');
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setAssignedTo('');
    setSimilarIssues([]);
    setShowSimilar(false);
    setConfirmCreate(false);
  };

  const getPriorityClass = (p: string) => {
    switch (p) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="glow" className="gap-2">
          <Plus className="w-4 h-4" />
          Create Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new issue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the issue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder={user?.email || 'user@email.com'}
              />
            </div>
          </div>

          {/* Similar Issues Warning */}
          {showSimilar && (
            <div className="rounded-lg border border-[hsl(var(--priority-medium)/0.3)] bg-[hsl(var(--priority-medium)/0.1)] p-4 animate-scale-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[hsl(var(--priority-medium))] mt-0.5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-foreground">Similar issues found</p>
                  <p className="text-xs text-muted-foreground">
                    We found {similarIssues.length} similar issue{similarIssues.length > 1 ? 's' : ''}. 
                    You may want to review them before creating a new one.
                  </p>
                  <div className="space-y-2 mt-3">
                    {similarIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="p-2 rounded bg-background/50 border border-border/50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium border', getPriorityClass(issue.priority))}>
                            {issue.priority}
                          </span>
                          <span className="font-medium truncate">{issue.title}</span>
                        </div>
                        <p className="text-muted-foreground mt-1 line-clamp-1">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            {similarIssues.length > 0 && !confirmCreate ? (
              <Button 
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmCreate(true)}
              >
                <Info className="w-4 h-4 mr-2" />
                Create Anyway
              </Button>
            ) : (
              <Button type="submit" variant="glow" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Create Issue
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueDialog;
