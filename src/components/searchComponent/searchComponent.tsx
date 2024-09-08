import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material';
import { SearchResult } from '@/types/types';
import { useNavigate } from 'react-router-dom';

interface GroupedOption extends SearchResult {
  category: string;
  label: string;
  url?: string;
}

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    people: SearchResult[];
    planets: SearchResult[];
    films: SearchResult[];
    species: SearchResult[];
    vehicles: SearchResult[];
    starships: SearchResult[];
  }>({
    people: [],
    planets: [],
    films: [],
    species: [],
    vehicles: [],
    starships: [],
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);

    const endpoints = {
      people: 'https://swapi.dev/api/people/',
      planets: 'https://swapi.dev/api/planets/',
      films: 'https://swapi.dev/api/films/',
      species: 'https://swapi.dev/api/species/',
      vehicles: 'https://swapi.dev/api/vehicles/',
      starships: 'https://swapi.dev/api/starships/',
    };

    try {
      const requests = Object.entries(endpoints).map(([key, url]) =>
        fetch(`${url}?search=${searchQuery}`).then((res) =>
          res.json().then((data) => ({ [key]: data.results || [] }))
        )
      );

      const responses = await Promise.all(requests);

      const groupedResults = responses.reduce(
        (acc, result) => {
          const key = Object.keys(result)[0] as keyof typeof results;
          acc[key] = result[key];
          return acc;
        },
        { people: [], planets: [], films: [], species: [], vehicles: [], starships: [] }
      );

      setResults(groupedResults);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutocompleteChange = (event: React.SyntheticEvent, value: string | null) => {
    if (value) {
      setQuery(value);
      handleSearch(value);
    }
  };

  const handleOptionSelect = (event: React.SyntheticEvent, selectedOption: GroupedOption | null) => {
    if (selectedOption) {
      navigate(`/${selectedOption.category.toLowerCase()}/${selectedOption.url.split('/').slice(-2, -1)[0]}`);
    }
  };

  const handleViewAll = (category: string) => {
    console.log(`View All clicked for ${category}`);
    navigate(`/${category.toLowerCase()}`);
  };

  const handleItemClick = () => {
    return false;
  };

  const categoryMap: { [key: string]: string } = {
    people: 'People',
    planets: 'Planets',
    films: 'Films',
    species: 'Species',
    vehicles: 'Vehicles',
    starships: 'Starships',
  };

  const options: GroupedOption[] = Object.entries(results)
    .flatMap(([key, items]) =>
      items.map((item) => ({
        label: item.name || item.title || '',
        category: categoryMap[key],
        ...item,
      }))
    )
    .filter((option) => option.label);

  return (
    <Autocomplete
      freeSolo
      options={options}
      groupBy={(option: GroupedOption) => option.category}
      getOptionLabel={(option: GroupedOption) => option.label}
      onInputChange={handleAutocompleteChange}
      onChange={handleOptionSelect}
      renderOption={({ key, ...props }, option) => (
        <li key={option.label} {...props} onClick={() => handleItemClick()}>
          <Typography>{option.label}</Typography>
        </li>
      )}
      renderGroup={(params) => (
        <div key={params.key}>
          <Box component="li" sx={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <Typography variant="h6">{params.group}</Typography>
          </Box>
          {params.children}
          <Box sx={{ textAlign: 'center', padding: '10px' }}>
            <Button variant="outlined" size="small" onClick={() => handleViewAll(params.group)}>
              View All {params.group}
            </Button>
          </Box>
        </div>
      )}
      renderInput={(params) => (
        <TextField sx={{ width: '50%' }} {...params} label="Search Star Wars Data" variant="outlined" />
      )}
      loading={loading}
    />
  );
};

export default SearchComponent;
