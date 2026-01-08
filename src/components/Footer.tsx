import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} CORE</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Sistema de Gestão Ágil</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            <span>para times que entregam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
