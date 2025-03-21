
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdAt: Date;
  createdBy: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  createdBy: string;
  assignedTo?: string[];
  groupId: string;
  tags?: string[];
}

export type Status = 'pending' | 'in-progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';
