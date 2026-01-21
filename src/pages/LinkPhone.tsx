import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate } from "react-router-dom";
import { Phone } from "lucide-react";

export default function LinkPhone() {
  const [telefone, setTelefone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { linkPhone, needsPhone, user } = useAuth();

  // Se não precisa de telefone ou não está logado, redireciona
  if (!needsPhone || !user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await linkPhone(telefone);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Máscara de telefone simples
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, "($1");
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{0,4})/, "($1) $2");
      } else if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
      }
    }
    setTelefone(value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo, {user.name}!
          </CardTitle>
          <CardDescription>
            Para completar seu cadastro e acessar o sistema, por favor informe seu número de telefone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={handlePhoneChange}
                required
                disabled={isLoading}
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">
                Este telefone deve ser o mesmo que foi vinculado à sua conta CORE
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || telefone.length < 14}>
              {isLoading ? "Salvando..." : "Continuar para o Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
