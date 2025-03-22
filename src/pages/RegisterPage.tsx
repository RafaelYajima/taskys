import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserPlus, ArrowRight, Loader2, Info } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { registerUser } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      console.log('Tentando registrar usuário:', data.name, data.email);
      const success = await registerUser(data.name, data.email, data.password);
      
      if (success) {
        console.log('Registro bem-sucedido');
        setIsRegistered(true);
        setRegisteredEmail(data.email);
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
      } else {
        console.log('Registro falhou');
        toast.error('Este email já está em uso!');
      }
    } catch (error) {
      console.error('Erro durante o registro:', error);
      toast.error('Ocorreu um erro ao criar sua conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Se registrado com sucesso, mostrar mensagem de confirmação
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md">
          <Card className="w-full animate-scale-in">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Info className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Verifique seu Email</CardTitle>
              <CardDescription className="text-center">
                Enviamos um link de confirmação para <strong>{registeredEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>Por favor, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.</p>
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Importante: Ao clicar no link no email, certifique-se de que você está no mesmo navegador/dispositivo onde fez o registro.</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Não recebeu o email? Verifique sua pasta de spam ou junk.</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full group"
              >
                Ir para o Login
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="w-full animate-scale-in">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Seu nome" 
                          {...field} 
                          className="transition-all duration-200 focus:ring-2"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu@email.com" 
                          {...field} 
                          type="email"
                          className="transition-all duration-200 focus:ring-2"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••" 
                          type="password" 
                          {...field}
                          className="transition-all duration-200 focus:ring-2"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••" 
                          type="password" 
                          {...field}
                          className="transition-all duration-200 focus:ring-2"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Após registrar-se, você receberá um email para confirmar sua conta.</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar Conta
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <div className="text-center text-sm">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-primary hover:underline transition-all">
                    Faça login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
