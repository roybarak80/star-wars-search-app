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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { fetchPeople, Person } from "@/services/starWarsApiService";
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

  const [formTouched, setFormTouched] = useState(false); 
  const { category } = useParams<{ category: string }>();

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
                    className={
                      highlightedRow === person.url ? styles.blinkingRow : ""
                    }
                    sx={{
                      backgroundColor:
                        highlightedRow === person.url ? "#1a1717" : "inherit",
                      transition: "background-color 0.3s ease",
                    }}
                  >
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
