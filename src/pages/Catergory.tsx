import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Pagination } from '@mui/material';
import { Delete, Edit, ArrowBack } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

interface Person {
  name: string;
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
}

const Category: React.FC = (): JSX.Element => {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1); // Current page number
  const [count, setCount] = useState(0); // Total number of people
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const { category } = useParams<{ category: string }>(); // Get the category from URL params
  const [newPerson, setNewPerson] = useState<Person>({
    name: '',
    height: '',
    mass: '',
    gender: '',
    birth_year: '',
  });

  useEffect(() => {
    if (category === 'people') {
      fetchPeople(page);
    }
  }, [page, category]);

  // Fetch people data for the current page
  const fetchPeople = async (page: number) => {
    try {
      const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
      const data = await response.json();
      const basicPeopleData = data.results.map((person: any) => ({
        name: person.name,
        height: person.height,
        mass: person.mass,
        gender: person.gender,
        birth_year: person.birth_year,
      }));
      setPeople(basicPeopleData);
      setCount(data.count); // Set the total count of people
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };

  const handleDelete = (name: string) => {
    setPeople(people.filter((person) => person.name !== name));
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setNewPerson(person);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingPerson) {
      setPeople(people.map((person) => (person.name === editingPerson.name ? newPerson : person)));
    } else {
      setPeople([...people, newPerson]);
    }
    setOpenDialog(false);
    setEditingPerson(null);
    setNewPerson({ name: '', height: '', mass: '', gender: '', birth_year: '' });
  };

  const handleCreate = () => {
    setEditingPerson(null);
    setNewPerson({ name: '', height: '', mass: '', gender: '', birth_year: '' });
    setOpenDialog(true);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className='page-wrapper'>
      <PageHeader category={category || ''} handleCreate={handleCreate} />

      {category === 'people' && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Height</TableCell>
                  <TableCell>Mass</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Birth Year</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {people.map((person) => (
                  <TableRow key={person.name}>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.height}</TableCell>
                    <TableCell>{person.mass}</TableCell>
                    <TableCell>{person.gender}</TableCell>
                    <TableCell>{person.birth_year}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(person)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(person.name)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              count={Math.ceil(count / 10)}
              page={page}
              onChange={handlePageChange}
            />
          </Box>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{editingPerson ? 'Edit Character' : 'Create New Character'}</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Height"
                fullWidth
                value={newPerson.height}
                onChange={(e) => setNewPerson({ ...newPerson, height: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Mass"
                fullWidth
                value={newPerson.mass}
                onChange={(e) => setNewPerson({ ...newPerson, mass: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Gender"
                fullWidth
                value={newPerson.gender}
                onChange={(e) => setNewPerson({ ...newPerson, gender: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Birth Year"
                fullWidth
                value={newPerson.birth_year}
                onChange={(e) => setNewPerson({ ...newPerson, birth_year: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingPerson ? 'Save' : 'Create'}</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Category;
