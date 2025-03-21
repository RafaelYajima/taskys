
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, Users, Calendar, ClipboardList } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Group } from '@/types';

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { getTasksForGroup, isGroupAdmin, getUserById, currentUser } = useApp();
  
  const tasks = getTasksForGroup(group.id);
  const isAdmin = isGroupAdmin(group.id);
  const creator = getUserById(group.createdBy);
  
  const formattedDate = format(new Date(group.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  const memberCount = group.members.length;
  const memberUsers = group.members.map(member => getUserById(member.userId)).filter(Boolean);
  const visibleMembers = memberUsers.slice(0, 3);
  const moreMembers = memberCount > 3 ? memberCount - 3 : 0;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const currentUserMember = group.members.find(member => member.userId === currentUser.id);
  const userRole = currentUserMember?.role;

  return (
    <Link to={`/groups/${group.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{group.name}</CardTitle>
            {isAdmin && (
              <Badge className="ml-2">
                <ShieldCheck className="h-3 w-3 mr-1" /> Admin
              </Badge>
            )}
          </div>
          <CardDescription>
            {group.description || 'Sem descrição'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            <span>Criado em {formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <ClipboardList className="h-4 w-4" />
            <span>{tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{memberCount} {memberCount === 1 ? 'membro' : 'membros'}</span>
            </div>
            
            {userRole && (
              <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                {userRole === 'admin' ? 'Admin' : 'Membro'}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 border-t">
          <div className="flex -space-x-2">
            {visibleMembers.map((member, index) => (
              <Avatar key={index} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member?.avatar} alt={member?.name} />
                <AvatarFallback className="text-xs">{getInitials(member?.name || '')}</AvatarFallback>
              </Avatar>
            ))}
            {moreMembers > 0 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{moreMembers}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GroupCard;
