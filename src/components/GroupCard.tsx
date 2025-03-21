
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Group } from '@/types';
import { Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { currentUser, joinGroup, leaveGroup, getTasksForGroup } = useApp();
  
  const isCurrentUserInGroup = group.members.some((member) => member.id === currentUser.id);
  const memberCount = group.members.length;
  const taskCount = getTasksForGroup(group.id).length;

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const handleJoinLeave = () => {
    if (isCurrentUserInGroup) {
      leaveGroup(group.id);
    } else {
      joinGroup(group.id);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-subtle">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">
          <Link 
            to={`/groups/${group.id}`} 
            className="hover:text-primary transition-colors"
          >
            {group.name}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {group.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {group.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center">
            <Users size={14} className="mr-1" />
            {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
          </Badge>
          
          <Badge variant="outline" className="flex items-center">
            <Calendar size={14} className="mr-1" />
            Criado em {formatDate(group.createdAt)}
          </Badge>
          
          {taskCount > 0 && (
            <Badge variant="secondary" className="flex items-center">
              {taskCount} {taskCount === 1 ? 'tarefa' : 'tarefas'}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant={isCurrentUserInGroup ? "outline" : "default"} 
          size="sm"
          onClick={handleJoinLeave}
        >
          {isCurrentUserInGroup ? 'Sair' : 'Participar'}
        </Button>
        
        {isCurrentUserInGroup && (
          <Button asChild variant="secondary" size="sm">
            <Link to={`/groups/${group.id}`}>
              Ver Tarefas
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
