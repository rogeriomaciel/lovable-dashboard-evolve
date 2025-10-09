import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Projeto } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

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
      <main className="container py-8">
        <h2 className="mb-6 text-3xl font-bold">Meus Projetos</h2>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : projetos.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-muted-foreground">
                Nenhum projeto encontrado
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Entre em contato com seu administrador para criar um novo projeto.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projetos.map((projeto) => (
              <ProjectCard key={projeto.id} projeto={projeto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
