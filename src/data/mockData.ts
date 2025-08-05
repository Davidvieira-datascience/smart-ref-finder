import { SearchResult } from "@/components/SearchResults";

// Mock data para simular resultados de busca
export const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    code: "NM-001-2024",
    description: "Bomba centrífuga horizontal para água, vazão 50 m³/h, altura manométrica 30 mca, motor elétrico 7,5 CV",
    category: "Equipamentos Rotativos",
    unit: "UN",
    price: 15750.00,
    similarity: 100,
    isExactMatch: true,
    source: "Planilha_Equipamentos_2024.xlsx"
  },
  {
    id: "2",
    code: "NM-002-2024",
    description: "Válvula gaveta em aço carbono DN 100 PN 16, com volante manual",
    category: "Válvulas e Acessórios",
    unit: "UN",
    price: 2850.00,
    similarity: 92,
    isExactMatch: false,
    source: "Planilha_Valvulas_2024.xlsx"
  },
  {
    id: "3",
    code: "NM-003-2024",
    description: "Tubo de aço carbono ASTM A106 Gr.B, diâmetro 4\", espessura 6,02 mm, comprimento 6 metros",
    category: "Tubulação",
    unit: "M",
    price: 285.50,
    similarity: 88,
    isExactMatch: false,
    source: "Planilha_Tubulacao_2024.xlsx"
  },
  {
    id: "4",
    code: "NM-004-2024",
    description: "Flange de aço carbono ASTM A105, face realçada, DN 100 PN 16",
    category: "Tubulação",
    unit: "UN",
    price: 425.00,
    similarity: 85,
    isExactMatch: false,
    source: "Planilha_Flanges_2024.xlsx"
  },
  {
    id: "5",
    code: "NM-005-2024",
    description: "Motor elétrico trifásico 220/380V, 7,5 CV, 1750 RPM, grau de proteção IP55",
    category: "Equipamentos Elétricos",
    unit: "UN",
    price: 3250.00,
    similarity: 82,
    isExactMatch: false,
    source: "Planilha_Motores_2024.xlsx"
  },
  {
    id: "6",
    code: "NM-006-2024",
    description: "Instrumentação: Transmissor de pressão 4-20mA, range 0-10 bar, rosca 1/2\" NPT",
    category: "Instrumentação",
    unit: "UN",
    price: 1850.00,
    similarity: 78,
    isExactMatch: false,
    source: "Planilha_Instrumentos_2024.xlsx"
  }
];

// Função para simular busca semântica
export function performSemanticSearch(
  query: string, 
  maxResults: number = 10
): SearchResult[] {
  // Simula uma busca com resultados variados baseados na query
  const searchTerms = query.toLowerCase();
  
  let results = [...mockSearchResults];
  
  // Simula correspondência semântica ajustando as similaridades
  results = results.map(result => {
    let similarity = Math.random() * 40 + 50; // 50-90%
    
    // Boost para termos que aparecem na descrição
    const description = result.description.toLowerCase();
    if (searchTerms.includes('bomba') && description.includes('bomba')) {
      similarity = Math.max(similarity, 95);
    }
    if (searchTerms.includes('válvula') && description.includes('válvula')) {
      similarity = Math.max(similarity, 92);
    }
    if (searchTerms.includes('motor') && description.includes('motor')) {
      similarity = Math.max(similarity, 90);
    }
    if (searchTerms.includes('tubo') && description.includes('tubo')) {
      similarity = Math.max(similarity, 88);
    }
    
    return {
      ...result,
      similarity: Math.round(similarity),
      isExactMatch: false
    };
  });
  
  // Ordena por similaridade
  results.sort((a, b) => b.similarity - a.similarity);
  
  return results.slice(0, maxResults);
}

// Função para simular busca híbrida por código
export function performHybridSearch(
  query: string, 
  maxResults: number = 10
): SearchResult[] {
  const results = [...mockSearchResults];
  
  // Verifica se a query é um código NM
  const isCodeSearch = /^NM-\d{3}-\d{4}$/i.test(query.trim());
  
  if (isCodeSearch) {
    // Busca exata por código
    const exactMatch = results.find(r => 
      r.code.toLowerCase() === query.trim().toLowerCase()
    );
    
    if (exactMatch) {
      // Retorna correspondência exata + itens similares
      const otherResults = results
        .filter(r => r.id !== exactMatch.id)
        .map(r => ({ ...r, similarity: Math.random() * 30 + 40 }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, maxResults - 1);
      
      return [
        { ...exactMatch, similarity: 100, isExactMatch: true },
        ...otherResults
      ];
    }
  }
  
  // Fallback para busca semântica
  return performSemanticSearch(query, maxResults);
}