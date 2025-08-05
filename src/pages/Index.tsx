import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SearchResults, { SearchResult } from "@/components/SearchResults";
import { Card, CardContent } from "@/components/ui/card";
import { performSemanticSearch, performHybridSearch } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Target, FileSpreadsheet, Download } from "lucide-react";

const Index = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (
    query: string, 
    type: 'semantic' | 'hybrid', 
    maxResults: number
  ) => {
    setIsLoading(true);
    setSelectedResults([]);
    
    try {
      // Simula delay da busca
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let searchResults: SearchResult[];
      if (type === 'hybrid') {
        searchResults = performHybridSearch(query, maxResults);
      } else {
        searchResults = performSemanticSearch(query, maxResults);
      }
      
      setResults(searchResults);
      setHasSearched(true);
      
      toast({
        title: "Busca concluída",
        description: `Encontrados ${searchResults.length} resultados para "${query}"`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'clipboard') => {
    const selectedData = results.filter(r => selectedResults.includes(r.id));
    
    if (selectedData.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum item selecionado",
        description: "Selecione pelo menos um resultado para exportar.",
      });
      return;
    }

    // Simula exportação
    toast({
      title: "Exportação realizada",
      description: `${selectedData.length} itens exportados em formato ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        {!hasSearched && (
          <div className="text-center space-y-6 py-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Busca Inteligente com IA
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Encontre referências técnicas de forma rápida e precisa usando 
                inteligência artificial para busca semântica e correspondência contextual.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card>
                <CardContent className="p-6 text-center space-y-3">
                  <Lightbulb className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Busca Semântica</h3>
                  <p className="text-sm text-muted-foreground">
                    Encontra resultados por significado, não apenas palavras exatas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center space-y-3">
                  <Target className="h-8 w-8 text-accent mx-auto" />
                  <h3 className="font-semibold">Correspondência Híbrida</h3>
                  <p className="text-sm text-muted-foreground">
                    Prioriza códigos NM exatos e mostra itens relacionados
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center space-y-3">
                  <Download className="h-8 w-8 text-success mx-auto" />
                  <h3 className="font-semibold">Exportação Fácil</h3>
                  <p className="text-sm text-muted-foreground">
                    Exporte resultados em CSV, Excel ou copie para área de transferência
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search Section */}
        <Card>
          <CardContent className="p-6">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <SearchResults
            results={results}
            selectedResults={selectedResults}
            onSelectionChange={setSelectedResults}
            onExport={handleExport}
          />
        )}

        {/* Instructions */}
        {!hasSearched && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <FileSpreadsheet className="h-6 w-6 text-primary mt-1" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Como usar o sistema:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Busca Semântica:</strong> Digite descrições de materiais ou equipamentos em linguagem natural</li>
                    <li><strong>Busca Híbrida:</strong> Digite códigos NM específicos para correspondência exata + itens similares</li>
                    <li><strong>Filtros:</strong> Ajuste o número de resultados exibidos (5, 10, 15 ou 20 itens)</li>
                    <li><strong>Exportação:</strong> Selecione os itens desejados e exporte em diferentes formatos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
