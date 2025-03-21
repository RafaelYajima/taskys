
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface GroupMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: GroupMember[];
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

export interface AuthUser extends User {
  password?: string;
}

export interface Notification {
  id: string;
  type: 'invite' | 'message';
  title: string;
  content: string;
  createdAt: Date;
  read: boolean;
  data?: {
    groupId?: string;
    senderId?: string;
  };
}

export interface Invite {
  id: string;
  groupId: string;
  email: string;
  sentAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
  senderId: string;
}
