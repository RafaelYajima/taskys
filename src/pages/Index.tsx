
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import ProfileSetup from '@/components/ProfileSetup';
import { CheckCircle, Users, Plus, ArrowRight } from 'lucide-react';

const Index = () => {
  const { groups, tasks } = useApp();
  const navigate = useNavigate();
  
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;

  const featuresData = [
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Organize Tarefas",
      description: "Crie, atribua e acompanhe tarefas facilmente em um único lugar."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Colaboração em Grupo",
      description: "Compartilhe tarefas com sua equipe ou família para melhor coordenação."
    },
    {
      icon: <Plus className="h-10 w-10 text-primary" />,
      title: "Simples e Intuitivo",
      description: "Interface minimalista focada na usabilidade e eficiência."
    }
  ];

  return (
    <>
      <ProfileSetup />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-12 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Organize tarefas em grupo com facilidade
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Compartilhe e coordene tarefas com sua equipe, família ou amigos.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button
                    onClick={() => navigate('/groups/new')}
                    size="lg"
                    className="animate-slide-up"
                    style={{ animationDelay: '100ms' }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Criar um Grupo
                  </Button>
                  {groups.length > 0 && (
                    <Button
                      onClick={() => navigate('/groups')}
                      variant="outline"
                      size="lg"
                      className="animate-slide-up"
                      style={{ animationDelay: '200ms' }}
                    >
                      <Users className="mr-2 h-4 w-4" /> Ver Meus Grupos
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          {tasks.length > 0 && (
            <section className="py-8 bg-muted/50">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-subtle animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <p className="text-5xl font-bold">{tasks.length}</p>
                    <p className="text-sm text-muted-foreground mt-2">Total de Tarefas</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-subtle animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <p className="text-5xl font-bold">{pendingTasks}</p>
                    <p className="text-sm text-muted-foreground mt-2">Tarefas Pendentes</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-subtle animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <p className="text-5xl font-bold">{groups.length}</p>
                    <p className="text-sm text-muted-foreground mt-2">Grupos Ativos</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Features Section */}
          <section className="py-12 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">Funcionalidades</h2>
                <p className="text-muted-foreground mt-2">
                  Tudo o que você precisa para gerenciar tarefas em grupo.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {featuresData.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-subtle animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-12">
                <Button onClick={() => navigate('/groups')} size="lg" className="group">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Tasky. Todos os direitos reservados.
              </p>
              <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
                Feito com ❤️ para organizar suas tarefas
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
