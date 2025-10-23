import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Projeto } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { Header } from "@/components/Header"; // Usando seu Header avançado
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { FocusOfWeek } from "@/components/FocusOfWeek";

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-6 bg-muted/40 overflow-auto">
        <div className="max-w-7xl mx-auto grid gap-6">
          {/* Seção de Foco adicionada */}
          <FocusOfWeek />

          {/* Seção de Projetos (Salas de Comando) */}
          <h2 className="text-2xl font-bold tracking-tight">Minhas Salas de Comando</h2>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projetos.map((projeto) => <ProjectCard key={projeto.id} projeto={projeto} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
