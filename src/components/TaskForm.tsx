
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';

interface TaskFormProps {
  groupId: string;
  members: { id: string; name: string }[];
  taskToEdit?: Task | null;
  onClose?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ groupId, members, taskToEdit, onClose }) => {
  const { createTask, updateTask } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({ title: '' });

  // Set form data when editing an existing task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setAssignedTo(taskToEdit.assignedTo || []);
      setShowForm(true);
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setErrors({ ...errors, title: 'O título da tarefa é obrigatório.' });
      return;
    }
    
    if (taskToEdit) {
      // Update existing task
      updateTask(taskToEdit.id, {
        title,
        description: description || undefined,
        priority,
        dueDate,
        assignedTo: assignedTo.length > 0 ? assignedTo : undefined
      });
    } else {
      // Create new task
      createTask(
        title,
        groupId,
        description || undefined,
        priority,
        dueDate,
        assignedTo.length > 0 ? assignedTo : undefined
      );
    }
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    setAssignedTo([]);
    setShowForm(false);
    if (onClose) onClose();
  };

  const toggleAssignment = (userId: string) => {
    setAssignedTo(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
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
    <div className="mb-6">
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full py-6 border-dashed border-2 border-muted-foreground/20 bg-muted/50 hover:bg-muted"
        >
          <Plus className="h-5 w-5 mr-2" /> Adicionar Tarefa
        </Button>
      ) : (
        <div className="bg-card border rounded-lg p-4 shadow-sm animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetForm}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                placeholder="Digite o título da tarefa"
                autoFocus
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os detalhes da tarefa (opcional)"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Atribuir a</Label>
              <div className="border rounded-md p-2">
                {members.length > 0 ? (
                  <div className="space-y-2">
                    {members.map(member => (
                      <div 
                        key={member.id} 
                        className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md"
                      >
                        <Checkbox 
                          id={`member-${member.id}`}
                          checked={assignedTo.includes(member.id)}
                          onCheckedChange={() => toggleAssignment(member.id)}
                        />
                        <Label
                          htmlFor={`member-${member.id}`}
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2">
                    Não há membros disponíveis para atribuição.
                  </p>
                )}
              </div>
            </div>
            
            {assignedTo.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {assignedTo.map(userId => {
                  const member = members.find(m => m.id === userId);
                  return (
                    <Badge 
                      key={userId} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[10px]">{getInitials(member?.name || '')}</AvatarFallback>
                      </Avatar>
                      <span>{member?.name}</span>
                      <button 
                        type="button"
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                        onClick={() => toggleAssignment(userId)}
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button type="submit">
                {taskToEdit ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" /> Salvar Alterações
                  </>
                ) : (
                  'Criar Tarefa'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
