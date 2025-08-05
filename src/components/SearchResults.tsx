import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Download, Copy, FileText, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface SearchResult {
  id: string;
  code: string;
  description: string;
  category: string;
  unit: string;
  price?: number;
  similarity: number;
  isExactMatch: boolean;
  source: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  selectedResults: string[];
  onSelectionChange: (selected: string[]) => void;
  onExport: (format: 'csv' | 'excel' | 'clipboard') => void;
}

export default function SearchResults({ 
  results, 
  selectedResults, 
  onSelectionChange, 
  onExport 
}: SearchResultsProps) {
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(results.map(r => r.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectResult = (resultId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedResults, resultId]);
    } else {
      onSelectionChange(selectedResults.filter(id => id !== resultId));
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return "bg-success";
    if (similarity >= 70) return "bg-primary";
    if (similarity >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhum resultado encontrado. Tente usar termos diferentes ou ajustar os filtros.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedResults.length === results.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedResults.length} de {results.length} selecionados
              </span>
            </div>
            
            {selectedResults.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onExport('clipboard')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-3">
        {results.map((result) => (
          <Card key={result.id} className={`transition-all hover:shadow-md ${
            selectedResults.includes(result.id) ? 'ring-2 ring-primary' : ''
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedResults.includes(result.id)}
                  onCheckedChange={(checked) => handleSelectResult(result.id, checked as boolean)}
                />
                
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {result.code}
                        </code>
                        {result.isExactMatch && (
                          <Badge variant="default" className="text-xs">
                            Correspondência Exata
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-foreground leading-relaxed">
                        {result.description}
                      </h3>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">
                        {Math.round(result.similarity)}% similar
                      </div>
                      <Progress 
                        value={result.similarity} 
                        className="w-20 h-2"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Categoria:</span>
                      <span className="font-medium">{result.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Unidade:</span>
                      <span className="font-medium">{result.unit}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Preço:</span>
                      <span className="font-medium">{formatPrice(result.price)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Fonte:</span>
                      <span className="font-medium">{result.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}