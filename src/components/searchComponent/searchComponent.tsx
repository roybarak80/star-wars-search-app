import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Autocomplete, TextField, Button, Box, Typography, Avatar } from '@mui/material';
import { SearchResult } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import { searchStarWarsData } from '@/services/starWarsApiService';
import { searchStarWarsImage } from '@/services/imageService';

interface GroupedOption extends SearchResult {
  category: string;
  label: string;
  url?: string;
  imageUrl?: string;
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
  const [images, setImages] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      console.log('Searching for:', searchQuery);
      setLoading(true);
      try {
        const groupedResults = await searchStarWarsData(searchQuery);
        console.log('Search results:', groupedResults);
        console.log('Total results:', Object.values(groupedResults).flat().length);
        setResults(groupedResults);
        
        // Fetch images for the results
        const allItems = Object.values(groupedResults).flat();
        const imagePromises = allItems.map(async (item) => {
          const name = item.name || item.title || '';
          if (name && !images[name]) {
            const imageUrl = await searchStarWarsImage(name);
            return { name, imageUrl };
          }
          return null;
        });
        
        const imageResults = await Promise.all(imagePromises);
        const newImages: { [key: string]: string } = {};
        imageResults.forEach(result => {
          if (result && result.imageUrl) {
            newImages[result.name] = result.imageUrl;
          }
        });
        
        setImages(prev => ({ ...prev, ...newImages }));
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [images]
  );

  const handleAutocompleteChange = (event: React.SyntheticEvent, value: string | null, reason: string) => {
    console.log('Autocomplete change:', { value, reason });
    
    if (value && reason === 'input' && value.length >= 2) {
      setQuery(value);
      debouncedSearch(value); 
    } else if (reason === 'clear') {
      console.log('Clearing results');
      setQuery('');
      setResults({
        people: [],
        planets: [],
        films: [],
        species: [],
        vehicles: [],
        starships: [],
      });
    }
  };

  const handleOptionSelect = (event: React.SyntheticEvent, selectedOption: GroupedOption | null) => {
    if (selectedOption && selectedOption.url) {
      navigate(`/${selectedOption.category.toLowerCase()}/${selectedOption.url.split('/').slice(-2, -1)[0]}`);
    }
  };

  const handleViewAll = (category: string) => {
    navigate(`/${category.toLowerCase()}`);
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
    .flatMap(([key, items]) => {
      console.log(`Processing category ${key}:`, items);
      return items.map((item) => {
        const name = item.name || item.title || '';
        const imageUrl = images[name] || undefined;
        console.log(`Option ${name}:`, { imageUrl, hasImage: !!imageUrl });
        return {
          label: name,
          category: categoryMap[key],
          imageUrl,
          ...item,
        };
      });
    })
    .filter((option) => {
      const isValid = option.label;
      console.log(`Filtering option "${option.label}":`, isValid);
      return isValid;
    });

  console.log('Final options array:', options);
  console.log('Results state:', results);

  return (
    <Autocomplete
      freeSolo
      options={options ? options : []}
      groupBy={(option: GroupedOption) => option.category}
      getOptionLabel={(option: GroupedOption) => option.label}
      onInputChange={handleAutocompleteChange}
      onChange={handleOptionSelect}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             
            <Avatar 
              src={option.imageUrl || undefined}
              sx={{ width: 42, height: 42 }}
              alt={option.label.charAt(0)}
            >
            </Avatar>
              <Typography>{option.label}</Typography>
            </Box>
          </li>
        );
      }}
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
