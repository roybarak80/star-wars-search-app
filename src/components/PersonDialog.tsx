import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

interface PersonDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  person: {
    name: string;
    height: string;
    mass: string;
    gender: string;
    birth_year: string;
  };
  setPerson: (person: Partial<PersonDialogProps['person']>) => void;
  errors: {
    name: string;
    height: string;
    mass: string;
    gender: string;
    birth_year: string;
  };
  formTouched: boolean;
}

const PersonDialog: React.FC<PersonDialogProps> = ({
  open,
  onClose,
  onSave,
  person,
  setPerson,
  errors,
  formTouched,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{person.name ? 'Edit Character' : 'Create New Character'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          value={person.name}
          onChange={(e) => setPerson({ name: e.target.value })}
          error={!!errors.name && formTouched}
          helperText={formTouched ? errors.name : ''}
        />
        <TextField
          margin="dense"
          label="Height"
          fullWidth
          value={person.height}
          onChange={(e) => setPerson({ height: e.target.value })}
          error={!!errors.height && formTouched}
          helperText={formTouched ? errors.height : ''}
        />
        <TextField
          margin="dense"
          label="Mass"
          fullWidth
          value={person.mass}
          onChange={(e) => setPerson({ mass: e.target.value })}
          error={!!errors.mass && formTouched}
          helperText={formTouched ? errors.mass : ''}
        />
        <TextField
          margin="dense"
          label="Gender"
          fullWidth
          value={person.gender}
          onChange={(e) => setPerson({ gender: e.target.value })}
          error={!!errors.gender && formTouched}
          helperText={formTouched ? errors.gender : ''}
        />
        <TextField
          margin="dense"
          label="Birth Year"
          fullWidth
          value={person.birth_year}
          onChange={(e) => setPerson({ birth_year: e.target.value })}
          error={!!errors.birth_year && formTouched}
          helperText={formTouched ? errors.birth_year : ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave}>
          {person.name ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonDialog;
