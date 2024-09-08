import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material';
import { SearchResult } from '@/types/types'; // Import your type
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

// Define GroupedOption, extending SearchResult
interface GroupedOption extends SearchResult {
  category: string; // Group for Autocomplete (People, Planets, etc.)
  label: string;    // Display label (either name or title)
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
  
  const navigate = useNavigate(); // Initialize the navigation hook

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

      // Explicitly type the groupedResults to match the structure of the state
      const groupedResults: {
        people: SearchResult[];
        planets: SearchResult[];
        films: SearchResult[];
        species: SearchResult[];
        vehicles: SearchResult[];
        starships: SearchResult[];
      } = responses.reduce(
        (acc, result) => {
          const key = Object.keys(result)[0] as keyof typeof results;
          acc[key] = result[key];
          return acc;
        },
        { people: [], planets: [], films: [], species: [], vehicles: [], starships: [] } // initial state structure
      );

      // Correctly assign the typed groupedResults to the state
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
      // Navigate to the appropriate category page using the category and ID from the selected option
      navigate(`/${selectedOption.category.toLowerCase()}/${selectedOption.url.split('/').slice(-2, -1)[0]}`);
    }
  };

  const handleViewAll = (category: string) => {
    // Navigate to the category page (e.g., /people, /planets)
     const lowerCaseCategory = category.toLowerCase();
  navigate(`/${lowerCaseCategory}`);
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
        label: item.name || item.title || '', // Use either name or title
        category: categoryMap[key], // Map key to category name
        ...item,
      }))
    )
    .filter((option) => option.label); // Filter out empty labels

  return (
   
      <Autocomplete
        freeSolo
        options={options}
        groupBy={(option: GroupedOption) => option.category} // Group options by category
        getOptionLabel={(option: GroupedOption) => option.label} // Display the label for each option
        onInputChange={handleAutocompleteChange}
        onChange={handleOptionSelect} // Handle option selection
        renderOption={({ key, ...props }, option) => (
          <li key={option.label} {...props}>
            <Typography>{option.label}</Typography>
          </li>
        )}
        renderGroup={(params) => (
          <div key={params.key}>
            <Box component="li" sx={{ padding: '10px',  borderBottom: '1px solid #ccc' }}>
              <Typography variant="h1">{params.group}</Typography>
            </Box>
            {params.children}
            <Box sx={{ textAlign: 'center', padding: '10px' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewAll(params.group)}
              >
                View All {params.group}
              </Button>
            </Box>
          </div>
        )}
        renderInput={(params) => (
          <TextField sx={{ width: '50%' }} {...params} label="Search Star Wars Data" variant="outlined" />
        )}
        loading={loading} // Display loading indicator if needed
      />
    
  );
};

export default SearchComponent;
