
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, ListFilter, Search, Calendar, ArrowLeft, ClipboardList } from 'lucide-react';
import ProfileSetup from '@/components/ProfileSetup';

const GroupDetailsPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { getGroupById, getTasksForGroup, currentUser } = useApp();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  
  const group = getGroupById(groupId || '');
  
  if (!group) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Grupo não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O grupo que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/groups')}>Voltar para Grupos</Button>
      </div>
    );
  }
  
  const isUserInGroup = group.members.some((member) => member.id === currentUser.id);
  const tasks = getTasksForGroup(group.id);
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const pendingTasks = filteredTasks.filter(task => task.status !== 'completed');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskDialog(true);
  };
  
  const handleCloseTaskForm = () => {
    setIsAddingTask(false);
    setEditingTask(undefined);
    setShowTaskDialog(false);
  };

  return (
    <>
      <ProfileSetup />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8 px-4 md:px-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/groups')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{group.name}</h1>
          </div>
          
          {group.description && (
            <p className="text-muted-foreground mb-6 max-w-3xl">
              {group.description}
            </p>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center">
                <Users size={14} className="mr-1" />
                {group.members.length} {group.members.length === 1 ? 'membro' : 'membros'}
              </Badge>
              
              <Badge variant="outline" className="flex items-center">
                <ClipboardList size={14} className="mr-1" />
                {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar tarefas..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isUserInGroup && (
                <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                    </DialogHeader>
                    <TaskForm
                      groupId={group.id}
                      editTask={editingTask}
                      onCancel={handleCloseTaskForm}
                      onSubmit={handleCloseTaskForm}
                    />
                  </DialogContent>
                  
                  <Button onClick={() => setShowTaskDialog(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Nova Tarefa
                  </Button>
                </Dialog>
              )}
            </div>
          </div>
          
          {!isUserInGroup ? (
            <Card className="p-6 text-center bg-muted/40">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Você não é membro deste grupo</h3>
              <p className="text-muted-foreground mb-4">
                Entre no grupo para ver e gerenciar as tarefas.
              </p>
              <Button onClick={() => useApp().joinGroup(group.id)}>
                Entrar no Grupo
              </Button>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="animate-fade-in">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Todas ({filteredTasks.length})</TabsTrigger>
                <TabsTrigger value="pending">Pendentes ({pendingTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Concluídas ({completedTasks.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="animate-slide-up">
                {filteredTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center bg-muted/40">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</h3>
                    {searchQuery ? (
                      <p className="text-muted-foreground">
                        Não encontramos nenhuma tarefa com "{searchQuery}".
                      </p>
                    ) : (
                      <>
                        <p className="text-muted-foreground mb-4">
                          Este grupo ainda não possui tarefas.
                        </p>
                        <Button onClick={() => setShowTaskDialog(true)}>
                          <PlusCircle className="h-4 w-4 mr-2" /> Criar Tarefa
                        </Button>
                      </>
                    )}
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="animate-slide-up">
                {pendingTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center bg-muted/40">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma tarefa pendente</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 
                        `Não encontramos nenhuma tarefa pendente com "${searchQuery}".` : 
                        'Todas as tarefas foram concluídas.'}
                    </p>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="animate-slide-up">
                {completedTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center bg-muted/40">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma tarefa concluída</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 
                        `Não encontramos nenhuma tarefa concluída com "${searchQuery}".` : 
                        'Nenhuma tarefa foi concluída ainda.'}
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </>
  );
};

export default GroupDetailsPage;
