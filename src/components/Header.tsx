
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { UserCircle, Home, Users, PlusCircle, Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { currentUser } = useApp();
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
        isActive(to)
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-secondary'
      }`}
    >
      {children}
    </Link>
  );

  const NavContent = () => (
    <div className="flex flex-col gap-2">
      <NavLink to="/">
        <Home size={20} />
        <span>Início</span>
      </NavLink>
      <NavLink to="/groups">
        <Users size={20} />
        <span>Grupos</span>
      </NavLink>
      <div className="mt-4 flex justify-center">
        <Button asChild className="w-full">
          <Link to="/groups/new">
            <PlusCircle size={18} className="mr-2" />
            Novo Grupo
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-xl text-primary">Tasky</span>
          </Link>

          {!isMobile && (
            <nav className="hidden md:flex items-center gap-4">
              <NavLink to="/">Início</NavLink>
              <NavLink to="/groups">Grupos</NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && (
            <Button asChild variant="outline" size="sm">
              <Link to="/groups/new">
                <PlusCircle size={18} className="mr-2" />
                Novo Grupo
              </Link>
            </Button>
          )}

          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden transition-transform hover:scale-110">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <UserCircle size={24} />
              )}
            </div>
          </Link>

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="py-4">
                  <NavContent />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
