export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Open' | 'In Progress' | 'Done';

export interface Issue {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  createdAt: Date;
  createdBy: string;
}

export interface IssueFormData {
  title: string;
  description: string;
  priority: Priority;
  assignedTo: string;
}
