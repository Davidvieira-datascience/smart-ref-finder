import { Building2, Search, BarChart3 } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Sistema Inteligente de Busca
                </h1>
                <p className="text-sm text-muted-foreground">
                  Referências Técnicas - Petrobras
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>IA Semântica</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Análise de Similaridade</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}