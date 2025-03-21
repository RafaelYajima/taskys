
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Home, Users, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobile } from '@/hooks/use-mobile';
import NotificationsMenu from './NotificationsMenu';

const Header = () => {
  const { currentUser, logoutUser } = useApp();
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const mobileMenuItems = (
    <div className="flex flex-col gap-2 p-4">
      <Link to="/" className="flex items-center p-2 rounded-md hover:bg-accent">
        <Home className="mr-2 h-5 w-5" />
        <span>Início</span>
      </Link>
      <Link to="/groups" className="flex items-center p-2 rounded-md hover:bg-accent">
        <Users className="mr-2 h-5 w-5" />
        <span>Grupos</span>
      </Link>
      <Link to="/profile" className="flex items-center p-2 rounded-md hover:bg-accent">
        <User className="mr-2 h-5 w-5" />
        <span>Perfil</span>
      </Link>
      <Separator className="my-2" />
      <Button variant="destructive" onClick={handleLogout} className="w-full justify-start">
        <LogOut className="mr-2 h-5 w-5" />
        <span>Sair</span>
      </Button>
    </div>
  );

  return (
    <header className="border-b h-16 flex items-center justify-between bg-background z-10 sticky top-0">
      <div className="container flex items-center justify-between h-full">
        <div className="flex items-center">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path
                      d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">{mobileMenuItems}</SheetContent>
            </Sheet>
          ) : null}
          <Link to="/" className="text-xl font-semibold flex items-center">
            <Check className="h-6 w-6 mr-2 text-primary" />
            <span className="hidden sm:inline-block">Tarefas Compartilhadas</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="mx-4 flex items-center space-x-4 lg:space-x-6 hidden md:flex">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Início
            </Link>
            <Link
              to="/groups"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Grupos
            </Link>
          </nav>
        )}

        <div className="flex items-center space-x-4">
          <NotificationsMenu />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
