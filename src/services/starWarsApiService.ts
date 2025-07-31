import { SearchResult } from "@/types/types";

const primaryEndpoints = {
  people: "https://swapi.py4e.com/api/people",
  planets: "https://swapi.py4e.com/api/planets",
  films: "https://swapi.py4e.com/api/films",
  species: "https://swapi.py4e.com/api/species",
  vehicles: "https://swapi.py4e.com/api/vehicles",
  starships: "https://swapi.py4e.com/api/starships",
};

const fallbackEndpoints = {
  people: "https://swapi.dev/api/people",
  planets: "https://swapi.dev/api/planets",
  films: "https://swapi.dev/api/films",
  species: "https://swapi.dev/api/species",
  vehicles: "https://swapi.dev/api/vehicles",
  starships: "https://swapi.dev/api/starships",
};

export interface GroupedResults {
  people: SearchResult[];
  planets: SearchResult[];
  films: SearchResult[];
  species: SearchResult[];
  vehicles: SearchResult[];
  starships: SearchResult[];
}

const fetchWithFallback = async (key: string, searchQuery: string) => {
  const urls = [
    `${primaryEndpoints[key as keyof typeof primaryEndpoints]}?search=${encodeURIComponent(searchQuery)}`,
    `${fallbackEndpoints[key as keyof typeof fallbackEndpoints]}?search=${encodeURIComponent(searchQuery)}`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return { [key]: data.results || [] };
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
      continue;
    }
  }
  
  console.error(`All endpoints failed for ${key}`);
  return { [key]: [] };
};

export const searchStarWarsData = async (
  searchQuery: string
): Promise<GroupedResults> => {
  if (!searchQuery.trim()) {
    return {
      people: [],
      planets: [],
      films: [],
      species: [],
      vehicles: [],
      starships: [],
    };
  }

  const requests = Object.keys(primaryEndpoints).map(key => 
    fetchWithFallback(key, searchQuery)
  );

  const responses = await Promise.all(requests);
  const groupedResults: GroupedResults = {
    people: [],
    planets: [],
    films: [],
    species: [],
    vehicles: [],
    starships: [],
  };

  responses.forEach((result) => {
    const key = Object.keys(result)[0] as keyof GroupedResults;
    groupedResults[key] = result[key];
  });

  return groupedResults;
};

export interface Person {
  name: string;
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
  url: string;
}

export const fetchPeople = async (
  page: number
): Promise<{ people: Person[]; count: number }> => {
  const urls = [
    `https://swapi.py4e.com/api/people/?page=${page}`,
    `https://swapi.dev/api/people/?page=${page}`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const people: Person[] = data.results.map((person: any) => ({
          name: person.name,
          height: person.height,
          mass: person.mass,
          gender: person.gender,
          birth_year: person.birth_year,
          url: person.url,
        }));
        return { people, count: data.count };
      }
    } catch (error) {
      console.warn(`Failed to fetch people from ${url}:`, error);
      continue;
    }
  }
  
  throw new Error('All people endpoints failed');
};
