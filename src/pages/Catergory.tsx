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
  Box,
  Pagination,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { Delete, Edit, ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { fetchPeople, Person } from "@/services/starWarsApiService";
import { searchStarWarsImage } from "@/services/imageService";
import PersonDialog from "@/components/PersonDialog";
import styles from "@/pages/Category.module.css";

const Category: React.FC = (): JSX.Element => {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1); 
  const [count, setCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [newPerson, setNewPerson] = useState<Person>({
    name: "",
    height: "",
    mass: "",
    gender: "",
    birth_year: "",
    url: "",
  });

  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    height: "",
    mass: "",
    gender: "",
    birth_year: "",
  });
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [personImages, setPersonImages] = useState<{ [key: string]: string }>({});

  const [formTouched, setFormTouched] = useState(false); 
  const { category, id } = useParams<{ category: string; id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (category === "people") {
      if (id) {
        // Fetch individual person details
        fetchPersonDetails(id);
      } else {
        fetchPeopleData(page);
      }
    }
  }, [page, category, id]);

  const fetchPeopleData = async (page: number) => {
    try {
      const { people, count } = await fetchPeople(page);
      setPeople(people);
      setCount(count);
      
      // Fetch images for all people
      const imagePromises = people.map(async (person) => {
        const imageUrl = await searchStarWarsImage(person.name);
        return { name: person.name, imageUrl };
      });
      
      const imageResults = await Promise.all(imagePromises);
      const newImages: { [key: string]: string } = {};
      imageResults.forEach(result => {
        if (result.imageUrl) {
          newImages[result.name] = result.imageUrl;
        }
      });
      
      setPersonImages(prev => ({ ...prev, ...newImages }));
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const fetchPersonDetails = async (personId: string) => {
    try {
      const response = await fetch(`https://swapi.py4e.com/api/people/${personId}/`);
      if (response.ok) {
        const personData = await response.json();
        const person: Person = {
          name: personData.name,
          height: personData.height,
          mass: personData.mass,
          gender: personData.gender,
          birth_year: personData.birth_year,
          url: personData.url,
        };
        setSelectedPerson(person);
        
        // Fetch image for the person
        const imageUrl = await searchStarWarsImage(person.name);
        setPersonImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching person details:", error);
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
      name: !newPerson.name && formTouched ? "Name is required" : "",
      height:
        (!newPerson.height || isNaN(Number(newPerson.height))) && formTouched
          ? "Height must be a number"
          : "",
      mass:
        (!newPerson.mass || isNaN(Number(newPerson.mass))) && formTouched
          ? "Mass must be a number"
          : "",
      gender: !newPerson.gender && formTouched ? "Gender is required" : "",
      birth_year:
        !newPerson.birth_year && formTouched ? "Birth year is required" : "",
    };
    setErrors(newErrors);
  };

  useEffect(() => {
    updateErrors();
  }, [newPerson, formTouched]);

  const handleSave = () => {
    setFormTouched(true);

    if (validatePerson()) {
      if (editingPerson) {
        setPeople(
          people.map((person) =>
            person.url === editingPerson.url ? newPerson : person
          )
        );
      } else {
        setPeople([...people, newPerson]);
      }


      setHighlightedRow(newPerson.url);
      setTimeout(() => setHighlightedRow(null), 10000); 
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
      setFormTouched(false);
    }
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

      {category === "people" && id && selectedPerson && (
        <Box sx={{ padding: "20px" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <Avatar 
              src={personImage || undefined}
              sx={{ width: 120, height: 120 }}
              alt={selectedPerson.name}
            >
              {selectedPerson.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {selectedPerson.name}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography><strong>Height:</strong> {selectedPerson.height} cm</Typography>
                <Typography><strong>Mass:</strong> {selectedPerson.mass} kg</Typography>
                <Typography><strong>Gender:</strong> {selectedPerson.gender}</Typography>
                <Typography><strong>Birth Year:</strong> {selectedPerson.birth_year}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {category === "people" && !id && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
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
                    className={
                      highlightedRow === person.url ? styles.blinkingRow : ""
                    }
                    sx={{
                      backgroundColor:
                        highlightedRow === person.url ? "#1a1717" : "inherit",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <TableCell>
                      <Avatar 
                        src={personImages[person.name] || undefined}
                        sx={{ width: 42, height: 42 }}
                        alt={person.name}
                      >
                        {person.name.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.height}</TableCell>
                    <TableCell>{person.mass}</TableCell>
                    <TableCell>{person.gender}</TableCell>
                    <TableCell>{person.birth_year}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(person)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setPeople(people.filter((p) => p.url !== person.url))
                        }
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
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

          <PersonDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSave={handleSave}
            person={newPerson}
            setPerson={(updatedFields) =>
              setNewPerson({ ...newPerson, ...updatedFields })
            }
            errors={errors}
            formTouched={formTouched}
          />
        </>
      )}
    </div>
  );
};

export default Category;
