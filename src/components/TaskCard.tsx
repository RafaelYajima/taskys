
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash2, 
  AlertCircle, 
  UserCircle,
  MoreHorizontal,
  CircleCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask, getUserById } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive border-destructive bg-destructive/10';
      case 'medium':
        return 'text-amber-500 border-amber-500 bg-amber-500/10';
      case 'low':
        return 'text-green-500 border-green-500 bg-green-500/10';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 border-green-500 bg-green-500/10';
      case 'in-progress':
        return 'text-primary border-primary bg-primary/10';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} className="mr-1" />;
      case 'in-progress':
        return <Circle size={14} className="mr-1" />;
      default:
        return <Circle size={14} className="mr-1" />;
    }
  };

  const toggleStatus = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTask(task.id);
    }, 300);
  };

  const formatDate = (date: Date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  };

  const creator = getUserById(task.createdBy);

  return (
    <Card className={`border overflow-hidden transition-all duration-300 hover:shadow-subtle ${isDeleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={toggleStatus}
            >
              {task.status === 'completed' ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-muted-foreground" />
              )}
            </Button>
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
              <AlertCircle size={12} className="mr-1" /> 
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
              {task.status === 'pending' ? 'Pendente' : 
               task.status === 'in-progress' ? 'Em Progresso' : 'Concluído'}
            </Badge>
            {task.dueDate && (
              <Badge variant="outline" className="text-xs">
                <Clock size={12} className="mr-1" /> 
                {formatDate(task.dueDate)}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate-scale-in">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit size={14} className="mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleStatus}>
              <CircleCheck size={14} className="mr-2" /> 
              {task.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluído'}
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                  <Trash2 size={14} className="mr-2" /> Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="animate-scale-in">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      {task.description && (
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground mt-2">
            {task.description}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <UserCircle size={14} className="mr-1" />
                  {creator ? creator.name : 'Usuário'}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Criado por {creator ? creator.name : 'Usuário'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(task.createdAt)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
