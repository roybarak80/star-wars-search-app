import { SearchResult } from "@/types/types";

const endpoints = {
  people: "https://swapi.dev/api/people/",
  planets: "https://swapi.dev/api/planets/",
  films: "https://swapi.dev/api/films/",
  species: "https://swapi.dev/api/species/",
  vehicles: "https://swapi.dev/api/vehicles/",
  starships: "https://swapi.dev/api/starships/",
};

export interface GroupedResults {
  people: SearchResult[];
  planets: SearchResult[];
  films: SearchResult[];
  species: SearchResult[];
  vehicles: SearchResult[];
  starships: SearchResult[];
}

export const searchStarWarsData = async (
  searchQuery: string
): Promise<GroupedResults> => {
  const requests = Object.entries(endpoints).map(([key, url]) =>
    fetch(`${url}?search=${searchQuery}`).then((res) =>
      res.json().then((data) => ({ [key]: data.results || [] }))
    )
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
  const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
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
};
