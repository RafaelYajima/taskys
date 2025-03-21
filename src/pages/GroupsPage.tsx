
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileSetup from '@/components/ProfileSetup';

const GroupsPage = () => {
  const { groups } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const userGroups = filteredGroups.filter(group => 
    group.members.some(member => member.userId === useApp().currentUser.id)
  );

  return (
    <>
      <ProfileSetup />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8 px-4 md:px-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Grupos</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus grupos e tarefas compartilhadas
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar grupos..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button asChild>
                <Link to="/groups/new">
                  <Plus className="h-4 w-4 mr-2" /> Novo Grupo
                </Link>
              </Button>
            </div>
          </div>

          {/* Meus Grupos */}
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Meus Grupos</h2>
            </div>
            
            {userGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center bg-muted/40">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum grupo encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não participa de nenhum grupo.
                </p>
                <Button asChild>
                  <Link to="/groups/new">
                    <Plus className="h-4 w-4 mr-2" /> Criar um Grupo
                  </Link>
                </Button>
              </Card>
            )}
          </div>

          {filteredGroups.length === 0 && searchQuery !== '' && (
            <Card className="p-6 text-center bg-muted/40 mt-8 animate-fade-in">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">
                Não encontramos nenhum grupo com "{searchQuery}".
              </p>
            </Card>
          )}
        </main>
      </div>
    </>
  );
};

export default GroupsPage;
