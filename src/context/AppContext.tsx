
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, Group, Task, AuthUser, Notification, Invite, GroupMember } from '@/types';
import { toast } from 'sonner';

interface AppContextType {
  currentUser: User;
  users: User[];
  groups: Group[];
  tasks: Task[];
  notifications: Notification[];
  invites: Invite[];
  isAuthenticated: boolean;
  createUser: (name: string) => User;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
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
  // Novos métodos de gerenciamento de grupo
  inviteToGroup: (groupId: string, email: string) => void;
  respondToInvite: (inviteId: string, accept: boolean) => void;
  changeMemberRole: (groupId: string, userId: string, newRole: 'admin' | 'member') => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  // Notificações
  getUnreadNotificationsCount: () => number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getUserInvites: () => Invite[];
  isGroupAdmin: (groupId: string) => boolean;
  getGroupMembers: (groupId: string) => (User & { role: 'admin' | 'member' })[];
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
    email: '',
  };

  const [currentUser, setCurrentUser] = useState<User>(() => 
    loadFromStorage('currentUser', defaultUser)
  );
  
  const [users, setUsers] = useState<User[]>(() => 
    loadFromStorage('users', [])
  );
  
  const [authUsers, setAuthUsers] = useState<AuthUser[]>(() => 
    loadFromStorage('authUsers', [])
  );
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    loadFromStorage('isAuthenticated', false)
  );
  
  const [groups, setGroups] = useState<Group[]>(() => 
    loadFromStorage('groups', [])
  );
  
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage('tasks', [])
  );

  const [notifications, setNotifications] = useState<Notification[]>(() => 
    loadFromStorage('notifications', [])
  );

  const [invites, setInvites] = useState<Invite[]>(() => 
    loadFromStorage('invites', [])
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage('currentUser', currentUser);
    saveToStorage('users', users);
    saveToStorage('authUsers', authUsers);
    saveToStorage('isAuthenticated', isAuthenticated);
    saveToStorage('groups', groups);
    saveToStorage('tasks', tasks);
    saveToStorage('notifications', notifications);
    saveToStorage('invites', invites);
  }, [currentUser, users, authUsers, isAuthenticated, groups, tasks, notifications, invites]);

  const createUser = (name: string): User => {
    const newUser: User = {
      id: uuidv4(),
      name,
      email: '',
    };
    
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    
    toast.success('Usuário criado com sucesso!');
    return newUser;
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    if (authUsers.some(user => user.email === email)) {
      return false;
    }

    const newUser: AuthUser = {
      id: uuidv4(),
      name,
      email,
      password,
    };
    
    setAuthUsers((prev) => [...prev, newUser]);
    
    // Also add to regular users array without password
    const userWithoutPassword: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
    
    setUsers((prev) => [...prev, userWithoutPassword]);
    setCurrentUser(userWithoutPassword);
    setIsAuthenticated(true);
    
    return true;
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    const user = authUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      const userWithoutPassword: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };
      
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(defaultUser);
    setIsAuthenticated(false);
    toast.success('Logout realizado com sucesso!');
  };

  const createGroup = (name: string, description?: string) => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      description,
      members: [
        {
          userId: currentUser.id,
          role: 'admin',
          joinedAt: new Date()
        }
      ],
      createdAt: new Date(),
      createdBy: currentUser.id,
    };
    
    setGroups((prev) => [...prev, newGroup]);
    toast.success('Grupo criado com sucesso!');
  };

  const joinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId && !group.members.some(member => member.userId === currentUser.id)) {
          return {
            ...group,
            members: [...group.members, {
              userId: currentUser.id,
              role: 'member',
              joinedAt: new Date()
            }],
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
            members: group.members.filter((member) => member.userId !== currentUser.id),
          };
        }
        return group;
      })
    );
    toast.success('Você saiu do grupo!');
  };

  const isGroupAdmin = (groupId: string): boolean => {
    const group = getGroupById(groupId);
    if (!group) return false;
    
    const memberInfo = group.members.find(member => member.userId === currentUser.id);
    return memberInfo?.role === 'admin';
  };

  const getGroupMembers = (groupId: string) => {
    const group = getGroupById(groupId);
    if (!group) return [];
    
    return group.members.map(member => {
      const user = getUserById(member.userId);
      if (!user) return null;
      
      return {
        ...user,
        role: member.role
      };
    }).filter(Boolean) as (User & { role: 'admin' | 'member' })[];
  };

  const inviteToGroup = (groupId: string, email: string) => {
    if (!isGroupAdmin(groupId)) {
      toast.error('Somente administradores podem convidar membros!');
      return;
    }
    
    // Check if user with this email exists
    const invitedUser = authUsers.find(user => user.email === email);
    
    if (!invitedUser) {
      toast.error('Usuário não encontrado com este email!');
      return;
    }
    
    // Check if user is already a member
    const group = getGroupById(groupId);
    if (group?.members.some(member => {
      const user = getUserById(member.userId);
      return user?.email === email;
    })) {
      toast.error('Este usuário já é membro do grupo!');
      return;
    }
    
    // Check if invite already exists
    if (invites.some(invite => invite.groupId === groupId && invite.email === email && invite.status === 'pending')) {
      toast.error('Já existe um convite pendente para este usuário!');
      return;
    }
    
    const newInvite: Invite = {
      id: uuidv4(),
      groupId,
      email,
      sentAt: new Date(),
      status: 'pending',
      senderId: currentUser.id
    };
    
    setInvites(prev => [...prev, newInvite]);
    
    // Create notification for invited user
    const newNotification: Notification = {
      id: uuidv4(),
      type: 'invite',
      title: 'Convite para Grupo',
      content: `Você foi convidado para participar do grupo ${group?.name}`,
      createdAt: new Date(),
      read: false,
      data: {
        groupId,
        senderId: currentUser.id
      }
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    toast.success('Convite enviado com sucesso!');
  };

  const respondToInvite = (inviteId: string, accept: boolean) => {
    const invite = invites.find(inv => inv.id === inviteId);
    
    if (!invite || invite.status !== 'pending') {
      toast.error('Convite inválido ou já respondido!');
      return;
    }
    
    // Update invite status
    setInvites(prev => prev.map(inv => 
      inv.id === inviteId 
        ? { ...inv, status: accept ? 'accepted' : 'rejected' } 
        : inv
    ));
    
    // If accepted, add user to group
    if (accept) {
      setGroups(prev => prev.map(group => {
        if (group.id === invite.groupId) {
          return {
            ...group,
            members: [...group.members, {
              userId: currentUser.id,
              role: 'member',
              joinedAt: new Date()
            }]
          };
        }
        return group;
      }));
      
      // Create notification for group admin
      const newNotification: Notification = {
        id: uuidv4(),
        type: 'message',
        title: 'Convite Aceito',
        content: `${currentUser.name} aceitou seu convite para o grupo`,
        createdAt: new Date(),
        read: false,
        data: {
          groupId: invite.groupId,
          senderId: currentUser.id
        }
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      toast.success('Você entrou no grupo!');
    } else {
      // Create notification for group admin
      const newNotification: Notification = {
        id: uuidv4(),
        type: 'message',
        title: 'Convite Recusado',
        content: `${currentUser.name} recusou seu convite para o grupo`,
        createdAt: new Date(),
        read: false,
        data: {
          groupId: invite.groupId,
          senderId: currentUser.id
        }
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      toast.success('Convite recusado');
    }
  };

  const changeMemberRole = (groupId: string, userId: string, newRole: 'admin' | 'member') => {
    if (!isGroupAdmin(groupId)) {
      toast.error('Somente administradores podem alterar cargos!');
      return;
    }
    
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.map(member => 
            member.userId === userId 
              ? { ...member, role: newRole }
              : member
          )
        };
      }
      return group;
    }));
    
    const user = getUserById(userId);
    toast.success(`Cargo de ${user?.name || 'usuário'} alterado para ${newRole === 'admin' ? 'Administrador' : 'Membro'}`);
  };

  const removeMemberFromGroup = (groupId: string, userId: string) => {
    if (!isGroupAdmin(groupId)) {
      toast.error('Somente administradores podem remover membros!');
      return;
    }
    
    // Prevent removing the last admin
    const group = getGroupById(groupId);
    if (!group) return;
    
    const admins = group.members.filter(member => member.role === 'admin');
    if (admins.length === 1 && admins[0].userId === userId) {
      toast.error('Não é possível remover o único administrador do grupo!');
      return;
    }
    
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.filter(member => member.userId !== userId)
        };
      }
      return group;
    }));
    
    const user = getUserById(userId);
    toast.success(`${user?.name || 'Usuário'} removido do grupo`);
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(notification => 
      !notification.read && 
      (!notification.data?.senderId || notification.data.senderId !== currentUser.id)
    ).length;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const getUserInvites = () => {
    return invites.filter(invite => {
      const user = authUsers.find(user => user.email === invite.email);
      return user?.id === currentUser.id && invite.status === 'pending';
    });
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
    
    // Notify assigned users
    if (assignedTo && assignedTo.length > 0) {
      const group = getGroupById(groupId);
      
      assignedTo.forEach(userId => {
        if (userId === currentUser.id) return; // Don't notify self
        
        const newNotification: Notification = {
          id: uuidv4(),
          type: 'message',
          title: 'Nova Tarefa Atribuída',
          content: `${currentUser.name} atribuiu a tarefa "${title}" para você no grupo ${group?.name}`,
          createdAt: new Date(),
          read: false,
          data: {
            groupId,
            senderId: currentUser.id
          }
        };
        
        setNotifications(prev => [...prev, newNotification]);
      });
    }
    
    toast.success('Tarefa criada com sucesso!');
  };

  const updateTask = (
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'groupId'>>
  ) => {
    // Get the current task to check for assignedTo changes
    const currentTask = tasks.find(task => task.id === taskId);
    const newAssignees = updates.assignedTo || [];
    const oldAssignees = currentTask?.assignedTo || [];
    
    // Find new assignees to notify
    const newlyAssigned = newAssignees.filter(id => !oldAssignees.includes(id));
    
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        return task;
      })
    );
    
    // Notify newly assigned users
    if (newlyAssigned.length > 0 && currentTask) {
      const group = getGroupById(currentTask.groupId);
      
      newlyAssigned.forEach(userId => {
        if (userId === currentUser.id) return; // Don't notify self
        
        const newNotification: Notification = {
          id: uuidv4(),
          type: 'message',
          title: 'Nova Tarefa Atribuída',
          content: `${currentUser.name} atribuiu a tarefa "${currentTask.title}" para você no grupo ${group?.name}`,
          createdAt: new Date(),
          read: false,
          data: {
            groupId: currentTask.groupId,
            senderId: currentUser.id
          }
        };
        
        setNotifications(prev => [...prev, newNotification]);
      });
    }
    
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
    notifications,
    invites,
    isAuthenticated,
    createUser,
    registerUser,
    loginUser,
    logoutUser,
    createGroup,
    joinGroup,
    leaveGroup,
    createTask,
    updateTask,
    deleteTask,
    getGroupById,
    getTasksForGroup,
    getUserById,
    inviteToGroup,
    respondToInvite,
    changeMemberRole,
    removeMemberFromGroup,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUserInvites,
    isGroupAdmin,
    getGroupMembers
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
