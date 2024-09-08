import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  category: string;
  handleCreate?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ category, handleCreate }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box sx={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
      <Typography variant="h1" sx={{ textTransform: 'capitalize' }}>{category}</Typography>

      {category === 'people' ? (
        <div className='page-right-btns-wrapper'>
          <Button size="small" variant="contained" onClick={handleCreate} className="small-button">
            Create New Character
          </Button>
          <Button onClick={handleBack}>
            <ArrowBack />
          </Button>
        </div>
      ) : (
        <Button onClick={handleBack}>
          <ArrowBack />
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
