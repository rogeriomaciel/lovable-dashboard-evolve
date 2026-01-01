import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Projeto } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { UserParadigms } from "@/components/UserParadigms";
import { DiaryPreview } from "@/components/DiaryPreview";
import { ActiveInitiatives } from "@/components/ActiveInitiatives";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjetos() {
      try {
        const data = await api.getProjetos();
        setProjetos(data);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProjetos();
  }, []);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 bg-muted/40 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header do usuário */}
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">Olá, {user?.name?.split(" ")[0] || "Usuário"}!</h1>
                  <p className="text-muted-foreground">
                    Bem-vindo ao seu painel de controle
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paradigmas do Usuário */}
          <UserParadigms paradigmas={user?.paradigmas || []} />

          {/* Grid principal: Projetos + Iniciativas */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Projetos (2/3 da largura) */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Minhas Salas de Comando
              </h2>
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))}
                </div>
              ) : projetos.length === 0 ? (
                <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground">Nenhum projeto encontrado</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use o CORE no WhatsApp para criar seu primeiro projeto.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {projetos.map((projeto) => (
                    <ProjectCard key={projeto.id} projeto={projeto} />
                  ))}
                </div>
              )}
            </div>

            {/* Iniciativas em Andamento (1/3 da largura) */}
            <div className="lg:col-span-1">
              <ActiveInitiatives />
            </div>
          </div>

          {/* Diário */}
          <DiaryPreview />
        </div>
      </main>
    </div>
  );
}
