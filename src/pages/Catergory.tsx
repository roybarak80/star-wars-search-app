import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Button,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { fetchPeople, Person } from "@/services/starWarsApiService";

const Category: React.FC = (): JSX.Element => {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const { category } = useParams<{ category: string }>();
  const [newPerson, setNewPerson] = useState<Person>({
    name: "",
    height: "",
    mass: "",
    gender: "",
    birth_year: "",
    url: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    height: "",
    mass: "",
    gender: "",
    birth_year: "",
  });

  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (category === "people") {
      fetchPeopleData(page);
    }
  }, [page, category]);

  const fetchPeopleData = async (page: number) => {
    try {
      const { people, count } = await fetchPeople(page);
      setPeople(people);
      setCount(count);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const validatePerson = (): boolean => {
    return !!(
      newPerson.name &&
      newPerson.height &&
      !isNaN(Number(newPerson.height)) &&
      newPerson.mass &&
      !isNaN(Number(newPerson.mass)) &&
      newPerson.gender &&
      newPerson.birth_year
    );
  };

  const updateErrors = () => {
    const newErrors = {
      name: newPerson.name ? "" : "Name is required",
      height:
        newPerson.height && !isNaN(Number(newPerson.height))
          ? ""
          : "Height must be a number",
      mass:
        newPerson.mass && !isNaN(Number(newPerson.mass))
          ? ""
          : "Mass must be a number",
      gender: newPerson.gender ? "" : "Gender is required",
      birth_year: newPerson.birth_year ? "" : "Birth year is required",
    };
    setErrors(newErrors);
  };

  useEffect(() => {
    const isValid = validatePerson();
    setIsFormValid(isValid);
  }, [newPerson]);

  useEffect(() => {
    updateErrors();
  }, [newPerson]);

  const handleSave = () => {
    if (isFormValid) {
      if (editingPerson) {
        setPeople(
          people.map((person) =>
            person.url === editingPerson.url ? newPerson : person
          )
        );
      } else {
        setPeople([...people, newPerson]);
      }
      setOpenDialog(false);
      setEditingPerson(null);
      setNewPerson({
        name: "",
        height: "",
        mass: "",
        gender: "",
        birth_year: "",
        url: "",
      });

      // Highlight the row of the added or edited person for 10 seconds
      setHighlightedRow(newPerson.url);
      setTimeout(() => setHighlightedRow(null), 10000); // Remove highlight after 10 seconds
    }
  };

  const handleDelete = (url: string) => {
    setPeople(people.filter((person) => person.url !== url));
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setNewPerson(person);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setEditingPerson(null);
    setNewPerson({
      name: "",
      height: "",
      mass: "",
      gender: "",
      birth_year: "",
      url: "",
    });
    setOpenDialog(true);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <div className="page-wrapper">
      <PageHeader category={category || ""} handleCreate={handleCreate} />

      {category === "people" && (
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
                  <TableRow
                    key={person.url}
                    sx={{
                      backgroundColor:
                        highlightedRow === person.url ? "#1e1c1c" : "inherit",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <>
                      <TableCell>{person.name}</TableCell>
                      <TableCell>{person.height}</TableCell>
                      <TableCell>{person.mass}</TableCell>
                      <TableCell>{person.gender}</TableCell>
                      <TableCell>{person.birth_year}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(person)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(person.url)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              count={Math.ceil(count / 10)}
              page={page}
              onChange={handlePageChange}
            />
          </Box>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>
              {editingPerson ? "Edit Character" : "Create New Character"}
            </DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={newPerson.name}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, name: e.target.value })
                }
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                margin="dense"
                label="Height"
                fullWidth
                value={newPerson.height}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, height: e.target.value })
                }
                error={!!errors.height}
                helperText={errors.height}
              />
              <TextField
                margin="dense"
                label="Mass"
                fullWidth
                value={newPerson.mass}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, mass: e.target.value })
                }
                error={!!errors.mass}
                helperText={errors.mass}
              />
              <TextField
                margin="dense"
                label="Gender"
                fullWidth
                value={newPerson.gender}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, gender: e.target.value })
                }
                error={!!errors.gender}
                helperText={errors.gender}
              />
              <TextField
                margin="dense"
                label="Birth Year"
                fullWidth
                value={newPerson.birth_year}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, birth_year: e.target.value })
                }
                error={!!errors.birth_year}
                helperText={errors.birth_year}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!isFormValid}>
                {editingPerson ? "Save" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Category;
