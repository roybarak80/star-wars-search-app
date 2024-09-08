import create from 'zustand';

interface SearchState {
  results: any[];
  loading: boolean;
  search: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  loading: false,
  search: async (query) => {
    set({ loading: true });
    
    const endpoints = {
      people: 'https://swapi.dev/api/people/',
      planets: 'https://swapi.dev/api/planets/',
      films: 'https://swapi.dev/api/films/',
      species: 'https://swapi.dev/api/species/',
      vehicles: 'https://swapi.dev/api/vehicles/',
      starships: 'https://swapi.dev/api/starships/',
    };

    try {
      const requests = Object.values(endpoints).map((url) =>
        fetch(`${url}?search=${query}`).then((res) => res.json())
      );

      const responses = await Promise.all(requests);

      const combinedResults = responses.flatMap((response) => response.results || []);

      set({ results: combinedResults, loading: false });
    } catch (error) {
      console.error('Search failed', error);
      set({ loading: false });
    }
  }
}));
