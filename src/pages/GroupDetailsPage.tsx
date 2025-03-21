
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import ProfileSetup from '@/components/ProfileSetup';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  X,
  Plus,
  UserPlus,
  ClipboardList,
  Settings,
  UserCog,
  ShieldCheck,
  UserCheck,
  UserX,
  LogOut,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const GroupDetailsPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const {
    getGroupById,
    getTasksForGroup,
    leaveGroup,
    currentUser,
    isGroupAdmin,
    getGroupMembers,
    inviteToGroup,
    changeMemberRole,
    removeMemberFromGroup,
  } = useApp();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [activeTab, setActiveTab] = useState('tarefas');
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  if (!groupId) {
    navigate('/groups');
    return null;
  }

  const group = getGroupById(groupId);
  if (!group) {
    navigate('/groups');
    return null;
  }

  const tasks = getTasksForGroup(groupId);
  const isAdmin = isGroupAdmin(groupId);
  const members = getGroupMembers(groupId);
  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const handleLeaveGroup = () => {
    if (window.confirm('Tem certeza que deseja sair do grupo?')) {
      leaveGroup(groupId);
      navigate('/groups');
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail) {
      setInviteError('Digite um email válido');
      return;
    }
    
    inviteToGroup(groupId, inviteEmail);
    setInviteEmail('');
    setShowInviteDialog(false);
  };

  const handleChangeRole = (userId: string, newRole: 'admin' | 'member') => {
    changeMemberRole(groupId, userId, newRole);
  };

  const handleRemoveMember = (userId: string) => {
    if (window.confirm('Tem certeza que deseja remover este membro?')) {
      removeMemberFromGroup(groupId, userId);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <ProfileSetup />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 container py-8 px-4 md:px-6 animate-fade-in">
          <div className="flex items-start justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                className="mb-2"
                onClick={() => navigate('/groups')}
              >
                <X className="h-4 w-4 mr-2" /> Voltar
              </Button>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              {group.description && (
                <p className="text-muted-foreground mt-1">{group.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" /> Convidar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Convidar para o grupo</DialogTitle>
                      <DialogDescription>
                        Envie um convite por email para adicionar alguém ao grupo.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInvite}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Digite o email do usuário"
                            value={inviteEmail}
                            onChange={(e) => {
                              setInviteEmail(e.target.value);
                              setInviteError('');
                            }}
                          />
                          {inviteError && (
                            <p className="text-xs text-destructive">{inviteError}</p>
                          )}
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button type="submit">Enviar Convite</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="destructive" onClick={handleLeaveGroup}>
                <LogOut className="h-4 w-4 mr-2" /> Sair do Grupo
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="tarefas">
                <ClipboardList className="h-4 w-4 mr-2" /> Tarefas
              </TabsTrigger>
              <TabsTrigger value="membros">
                <Users className="h-4 w-4 mr-2" /> Membros ({members.length})
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="configuracoes">
                  <Settings className="h-4 w-4 mr-2" /> Configurações
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="tarefas" className="space-y-6">
              <TaskForm groupId={groupId} members={members.map(m => ({ id: m.id, name: m.name }))} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarefas Pendentes */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">Pendentes</CardTitle>
                      <Badge variant="outline">{pendingTasks.length}</Badge>
                    </div>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingTasks.length > 0 ? (
                      pendingTasks.map((task) => (
                        <TaskCard key={task.id} task={task} groupMembers={members} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Nenhuma tarefa pendente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tarefas Em Progresso */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">Em Progresso</CardTitle>
                      <Badge variant="outline">{inProgressTasks.length}</Badge>
                    </div>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inProgressTasks.length > 0 ? (
                      inProgressTasks.map((task) => (
                        <TaskCard key={task.id} task={task} groupMembers={members} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Nenhuma tarefa em progresso</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tarefas Concluídas */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">Concluídas</CardTitle>
                      <Badge variant="outline">{completedTasks.length}</Badge>
                    </div>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedTasks.length > 0 ? (
                      completedTasks.map((task) => (
                        <TaskCard key={task.id} task={task} groupMembers={members} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Nenhuma tarefa concluída</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="membros">
              <Card>
                <CardHeader>
                  <CardTitle>Membros do Grupo</CardTitle>
                  <CardDescription>
                    Pessoas que participam deste grupo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="mx-2">
                            {member.role === 'admin' ? (
                              <ShieldCheck className="h-3 w-3 mr-1" />
                            ) : (
                              <UserCheck className="h-3 w-3 mr-1" />
                            )}
                            {member.role === 'admin' ? 'Admin' : 'Membro'}
                          </Badge>
                          
                          {isAdmin && member.id !== currentUser.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleChangeRole(
                                  member.id,
                                  member.role === 'admin' ? 'member' : 'admin'
                                )}>
                                  {member.role === 'admin' ? (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Tornar Membro
                                    </>
                                  ) : (
                                    <>
                                      <ShieldCheck className="h-4 w-4 mr-2" />
                                      Tornar Admin
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="configuracoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações do Grupo</CardTitle>
                    <CardDescription>
                      Gerencie as configurações deste grupo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="group-name">Nome do Grupo</Label>
                      <Input
                        id="group-name"
                        defaultValue={group.name}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group-description">Descrição</Label>
                      <Input
                        id="group-description"
                        defaultValue={group.description || ''}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group-created">Criado em</Label>
                      <Input
                        id="group-created"
                        defaultValue={new Date(group.createdAt).toLocaleDateString()}
                        disabled
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Edição de detalhes do grupo será implementada em uma atualização futura.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default GroupDetailsPage;
