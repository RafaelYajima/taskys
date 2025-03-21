
import React from 'react';
import { Bell, Check, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const NotificationsMenu = () => {
  const { 
    notifications, 
    getUnreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    getUserInvites,
    respondToInvite
  } = useApp();

  const unreadCount = getUnreadNotificationsCount();
  const pendingInvites = getUserInvites();
  const recentNotifications = notifications
    .filter(n => !n.data?.senderId || n.data.senderId !== useApp().currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAllNotificationsAsRead();
  };

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="text-base font-semibold">Notificações</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {pendingInvites.length > 0 && (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-sm font-medium text-muted-foreground px-2">
              Convites Pendentes
            </DropdownMenuLabel>
            
            {pendingInvites.map(invite => {
              const group = useApp().getGroupById(invite.groupId);
              const sender = useApp().getUserById(invite.senderId);
              
              return (
                <div key={invite.id} className="p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">
                        Convite para o grupo {group?.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        De {sender?.name} · {getRelativeTime(new Date(invite.sentAt))}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => respondToInvite(invite.id, true)}
                        >
                          Aceitar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => respondToInvite(invite.id, false)}
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        
        <DropdownMenuGroup>
          {recentNotifications.length > 0 ? (
            <>
              {recentNotifications.map((notification) => {
                const isInvite = notification.type === 'invite';
                const group = notification.data?.groupId 
                  ? useApp().getGroupById(notification.data.groupId)
                  : undefined;
                
                return (
                  <DropdownMenuItem 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`flex items-start gap-2 p-2 cursor-pointer ${!notification.read ? 'bg-muted/40' : ''}`}
                  >
                    {isInvite ? (
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                    ) : (
                      <Bell className="h-5 w-5 text-primary mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground">{notification.content}</p>
                      {group && (
                        <Link 
                          to={`/groups/${group.id}`} 
                          className="text-xs text-primary hover:underline mt-1 inline-block"
                        >
                          Ir para o grupo
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {getRelativeTime(new Date(notification.createdAt))}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
