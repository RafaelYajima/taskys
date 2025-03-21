
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, Group, Task } from '@/types';
import { toast } from 'sonner';

interface AppContextType {
  currentUser: User;
  users: User[];
  groups: Group[];
  tasks: Task[];
  createUser: (name: string) => User;
  createGroup: (name: string, description?: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  createTask: (
    title: string,
    groupId: string,
    description?: string,
    priority?: 'low' | 'medium' | 'high',
    dueDate?: Date,
    assignedTo?: string[]
  ) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'groupId'>>) => void;
  deleteTask: (taskId: string) => void;
  getGroupById: (groupId: string) => Group | undefined;
  getTasksForGroup: (groupId: string) => Task[];
  getUserById: (userId: string) => User | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to load data from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Helper function to save data to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a default user if none exists
  const defaultUser: User = {
    id: uuidv4(),
    name: 'Usuário',
  };

  const [currentUser, setCurrentUser] = useState<User>(() => 
    loadFromStorage('currentUser', defaultUser)
  );
  
  const [users, setUsers] = useState<User[]>(() => 
    loadFromStorage('users', [currentUser])
  );
  
  const [groups, setGroups] = useState<Group[]>(() => 
    loadFromStorage('groups', [])
  );
  
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage('tasks', [])
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage('currentUser', currentUser);
    saveToStorage('users', users);
    saveToStorage('groups', groups);
    saveToStorage('tasks', tasks);
  }, [currentUser, users, groups, tasks]);

  const createUser = (name: string): User => {
    const newUser: User = {
      id: uuidv4(),
      name,
    };
    
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    
    toast.success('Usuário criado com sucesso!');
    return newUser;
  };

  const createGroup = (name: string, description?: string) => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      description,
      members: [currentUser],
      createdAt: new Date(),
      createdBy: currentUser.id,
    };
    
    setGroups((prev) => [...prev, newGroup]);
    toast.success('Grupo criado com sucesso!');
  };

  const joinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId && !group.members.some(member => member.id === currentUser.id)) {
          return {
            ...group,
            members: [...group.members, currentUser],
          };
        }
        return group;
      })
    );
    toast.success('Você entrou no grupo!');
  };

  const leaveGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter((member) => member.id !== currentUser.id),
          };
        }
        return group;
      })
    );
    toast.success('Você saiu do grupo!');
  };

  const createTask = (
    title: string,
    groupId: string,
    description?: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    dueDate?: Date,
    assignedTo?: string[]
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'pending',
      priority,
      dueDate,
      createdAt: new Date(),
      createdBy: currentUser.id,
      assignedTo,
      groupId,
    };
    
    setTasks((prev) => [...prev, newTask]);
    toast.success('Tarefa criada com sucesso!');
  };

  const updateTask = (
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'groupId'>>
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        return task;
      })
    );
    toast.success('Tarefa atualizada com sucesso!');
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success('Tarefa removida com sucesso!');
  };

  const getGroupById = (groupId: string) => {
    return groups.find((group) => group.id === groupId);
  };

  const getTasksForGroup = (groupId: string) => {
    return tasks.filter((task) => task.groupId === groupId);
  };

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const value = {
    currentUser,
    users,
    groups,
    tasks,
    createUser,
    createGroup,
    joinGroup,
    leaveGroup,
    createTask,
    updateTask,
    deleteTask,
    getGroupById,
    getTasksForGroup,
    getUserById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
