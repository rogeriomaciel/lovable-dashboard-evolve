import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/types";
import { api, setupInterceptors } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (telefone: string, senha: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  linkPhone: (phoneNumber: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  needsPhone: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsPhone, setNeedsPhone] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setNeedsPhone(false);
    navigate("/login");
    toast({
      title: "Sessão expirada",
      description: "Por favor, faça login novamente.",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);

    // Configura o interceptor da API para deslogar em caso de erro 401
    setupInterceptors(logout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (telefone: string, senha: string) => {
    try {
      const response = await api.login(telefone, senha);
      localStorage.setItem("access_token", response.access_token);
      
      const userData = {
        id: "",
        nome: "",
        telefone: response.payload.phone_number,
        phone_number: response.payload.phone_number,
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setNeedsPhone(false);
      navigate("/");
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Painel CORE",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const response = await api.loginWithGoogle(credential);
      
      localStorage.setItem("access_token", response.access_token);
      
      if (response.needs_phone) {
        setNeedsPhone(true);
        setUser(response.user || null);
        navigate("/link-phone");
        toast({
          title: "Bem-vindo!",
          description: "Por favor, cadastre seu telefone para continuar.",
        });
      } else {
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user || null);
        setNeedsPhone(false);
        navigate("/");
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a), ${response.user?.nome}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login com Google",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const linkPhone = async (phoneNumber: string) => {
    try {
      const response = await api.linkPhone(phoneNumber);
      
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        setNeedsPhone(false);
        navigate("/");
        toast({
          title: "Telefone cadastrado com sucesso!",
          description: "Agora você pode acessar o sistema.",
        });
      } else {
        throw new Error(response.error || "Erro ao cadastrar telefone");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar telefone",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, linkPhone, logout, isLoading, needsPhone }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
