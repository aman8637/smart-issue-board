import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Issue, IssueFormData, Status } from '@/types/issue';

interface IssueContextType {
  issues: Issue[];
  addIssue: (data: IssueFormData, createdBy: string) => Issue;
  updateIssueStatus: (id: string, newStatus: Status) => { success: boolean; message?: string };
  findSimilarIssues: (title: string, description: string) => Issue[];
}

const IssueContext = createContext<IssueContextType | null>(null);

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

const ISSUES_KEY = 'smart_issue_board_issues';

export const IssueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(ISSUES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setIssues(parsed.map((issue: Issue) => ({
        ...issue,
        createdAt: new Date(issue.createdAt)
      })));
    }
  }, []);

  const saveIssues = (newIssues: Issue[]) => {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(newIssues));
    setIssues(newIssues);
  };

  const addIssue = (data: IssueFormData, createdBy: string): Issue => {
    const newIssue: Issue = {
      id: `issue_${Date.now()}`,
      ...data,
      status: 'Open',
      createdAt: new Date(),
      createdBy
    };

    saveIssues([newIssue, ...issues]);
    return newIssue;
  };

  const updateIssueStatus = (id: string, newStatus: Status): { success: boolean; message?: string } => {
    const issue = issues.find(i => i.id === id);
    
    if (!issue) {
      return { success: false, message: 'Issue not found' };
    }

    // Status rule: Cannot move directly from Open to Done
    if (issue.status === 'Open' && newStatus === 'Done') {
      return { 
        success: false, 
        message: "Hold on! Issues need to be 'In Progress' before they can be marked as 'Done'. Please move it to 'In Progress' first." 
      };
    }

    const updatedIssues = issues.map(i => 
      i.id === id ? { ...i, status: newStatus } : i
    );
    
    saveIssues(updatedIssues);
    return { success: true };
  };

  const findSimilarIssues = (title: string, description: string): Issue[] => {
    const searchText = `${title} ${description}`.toLowerCase();
    const words = searchText.split(/\s+/).filter(word => word.length > 3);
    
    if (words.length === 0) return [];

    return issues.filter(issue => {
      const issueText = `${issue.title} ${issue.description}`.toLowerCase();
      const matchCount = words.filter(word => issueText.includes(word)).length;
      return matchCount >= Math.ceil(words.length * 0.3); // 30% word match threshold
    }).slice(0, 5);
  };

  return (
    <IssueContext.Provider value={{ issues, addIssue, updateIssueStatus, findSimilarIssues }}>
      {children}
    </IssueContext.Provider>
  );
};
