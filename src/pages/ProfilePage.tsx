
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Save, ArrowLeft } from 'lucide-react';
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
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          
          <Card className="w-full animate-scale-in">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
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
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 p-4 rounded-md bg-muted">
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
                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" /> Salvar Alterações
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
