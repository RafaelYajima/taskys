
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, X, Check } from 'lucide-react';
import ProfileSetup from '@/components/ProfileSetup';

const NewGroupPage = () => {
  const { createGroup } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setErrors({ ...errors, name: 'O nome do grupo é obrigatório.' });
      return;
    }
    
    createGroup(name, description || undefined);
    navigate('/groups');
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
            onClick={() => navigate('/groups')}
          >
            <X className="h-4 w-4 mr-2" /> Voltar
          </Button>
          
          <Card className="w-full animate-scale-in">
            <CardHeader>
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Novo Grupo</CardTitle>
              <CardDescription className="text-center">
                Crie um grupo para compartilhar tarefas com outras pessoas
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Grupo *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    placeholder="Digite o nome do grupo"
                    autoFocus
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o propósito do grupo (opcional)"
                    rows={3}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full">
                  <Check className="h-4 w-4 mr-2" /> Criar Grupo
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </>
  );
};

export default NewGroupPage;
