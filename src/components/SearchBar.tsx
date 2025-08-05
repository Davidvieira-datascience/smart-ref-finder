import { useState } from "react";
import { Search, Filter, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  onSearch: (query: string, type: 'semantic' | 'hybrid', maxResults: number) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<'semantic' | 'hybrid'>('semantic');
  const [maxResults, setMaxResults] = useState(10);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), searchType, maxResults);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Digite sua busca por materiais, equipamentos ou serviços..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-4 h-12 text-base"
          disabled={isLoading}
        />
      </div>

      {/* Search Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          {/* Search Type */}
          <div className="flex gap-2">
            <Badge 
              variant={searchType === 'semantic' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSearchType('semantic')}
            >
              <Filter className="h-3 w-3 mr-1" />
              Busca Semântica
            </Badge>
            <Badge 
              variant={searchType === 'hybrid' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSearchType('hybrid')}
            >
              <Settings className="h-3 w-3 mr-1" />
              Busca Híbrida (NM)
            </Badge>
          </div>

          {/* Max Results */}
          <Select value={maxResults.toString()} onValueChange={(value) => setMaxResults(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 resultados</SelectItem>
              <SelectItem value="10">10 resultados</SelectItem>
              <SelectItem value="15">15 resultados</SelectItem>
              <SelectItem value="20">20 resultados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSearch} 
          disabled={!query.trim() || isLoading}
          className="px-8"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>
    </div>
  );
}