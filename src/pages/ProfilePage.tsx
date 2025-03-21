
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Save, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import ProfileSetup from '@/components/ProfileSetup';

const ProfilePage = () => {
  const { currentUser, createUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser.name);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }
    
    createUser(name);
    toast.success('Perfil atualizado com sucesso!');
  };

  return (
    <>
      <ProfileSetup />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container max-w-lg py-8 px-4 md:px-6 animate-fade-in">
          <Button
            variant="ghost"
            className="mb-4 group transition-all duration-200"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
          </Button>
          
          <Card className="w-full animate-scale-in shadow-medium hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                <UserCircle className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Meu Perfil</CardTitle>
              <CardDescription className="text-center">
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) {
                        setError('');
                      }
                    }}
                    placeholder="Digite seu nome"
                    autoFocus
                    className="transition-all duration-200 focus:ring-2"
                  />
                  {error && <p className="text-xs text-destructive animate-fade-in">{error}</p>}
                </div>
                
                {currentUser.email && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{currentUser.email}</span>
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 p-4 rounded-md bg-muted hover:bg-muted/70 transition-colors">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Informações do Usuário</h3>
                      <p className="text-xs text-muted-foreground">
                        ID: {currentUser.id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full group">
                  <Save className="h-4 w-4 mr-2 group-hover:rotate-[-10deg] transition-transform" /> 
                  Salvar Alterações
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
