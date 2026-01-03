import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, KeyRound, Sun, Moon, Laptop, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserScoreDisplay } from "./UserScoreDisplay";
import { ScoreData } from "@/lib/types";

import { cn } from "@/lib/utils";

export function Header() {
  const { user, logout } = useAuth();
  const [score, setScore] = useState<ScoreData | null>(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  //const [score, setScore] = useState<ScoreData | null>(null);

  function applyTheme(t: "light" | "dark" | "system") {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (t === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(t);
    }
  }

  useEffect(() => {
    async function loadData() {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Padrão inicial
        applyTheme("dark");
      }
      // Usamos Promise.allSettled para garantir que, se uma API falhar, as outras ainda carreguem.
      const results = await Promise.allSettled([
        api.getScore()
      ]);



        // Processa o resultado dos projetos
        if (results[0].status === "fulfilled") {
          setScore(results[0].value);
        }
      }
      loadData();


  }, []);


  const handleThemeChange = (t: "light" | "dark" | "system") => {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLevelBorderColor = (level: number | undefined): string => {
    if (!level) return "border-transparent";
    if (level >= 10) return "border-yellow-400"; // Dourado
    if (level >= 5) return "border-primary"; // Azul
    return "border-muted"; // Cinza
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-xl font-bold">Painel de Controle CORE</h1>
        
        {user && (
          <div className="flex items-center gap-4">
            <UserScoreDisplay score={score} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className={cn("h-10 w-10 border-2 transition-colors", getLevelBorderColor(score?.nivel_numerico))}>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.phone_number}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Tema
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleThemeChange("light")} className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  Claro
                  {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  Escuro
                  {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("system")} className="cursor-pointer">
                  <Laptop className="mr-2 h-4 w-4" />
                  Sistema
                  {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/redefinir-senha")} className="cursor-pointer">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Redefinir Senha
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
