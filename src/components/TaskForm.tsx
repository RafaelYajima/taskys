
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface TaskFormProps {
  groupId: string;
  editTask?: Task;
  onCancel: () => void;
  onSubmit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ groupId, editTask, onCancel, onSubmit }) => {
  const { createTask, updateTask } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setPriority(editTask.priority);
      setDueDate(editTask.dueDate);
    }
  }, [editTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório.');
      return;
    }
    
    if (editTask) {
      updateTask(editTask.id, {
        title,
        description: description || undefined,
        priority,
        dueDate,
      });
      toast.success('Tarefa atualizada com sucesso!');
    } else {
      createTask(
        title,
        groupId,
        description || undefined,
        priority,
        dueDate
      );
      toast.success('Tarefa criada com sucesso!');
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Digite o título da tarefa"
          autoFocus
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva a tarefa (opcional)"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Prioridade</Label>
        <RadioGroup 
          value={priority} 
          onValueChange={(value) => setPriority(value as Priority)}
          className="flex gap-4"
        >
          <div className="flex items-center">
            <RadioGroupItem value="low" id="low" className="peer sr-only" />
            <Label
              htmlFor="low"
              className="flex items-center gap-1.5 rounded-md border border-muted px-3 py-2 text-sm peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:text-green-500 cursor-pointer"
            >
              Baixa
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
            <Label
              htmlFor="medium"
              className="flex items-center gap-1.5 rounded-md border border-muted px-3 py-2 text-sm peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:text-amber-500 cursor-pointer"
            >
              Média
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="high" id="high" className="peer sr-only" />
            <Label
              htmlFor="high"
              className="flex items-center gap-1.5 rounded-md border border-muted px-3 py-2 text-sm peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive cursor-pointer"
            >
              Alta
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Data de Vencimento</Label>
        <div className="flex gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {dueDate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setDueDate(undefined)}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          <Check size={16} className="mr-2" />
          {editTask ? 'Atualizar Tarefa' : 'Criar Tarefa'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
