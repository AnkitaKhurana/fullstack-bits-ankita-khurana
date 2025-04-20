import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { vaccinationDrives } from '../services/api';
import VaccinationDriveForm from '../components/vaccination/VaccinationDriveForm';

const DriveDetails = ({ drive, onClose }) => (
  <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Vaccination Drive Details</DialogTitle>
    <DialogContent>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Vaccine Name</Typography>
          <Typography>{drive.vaccineName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Date</Typography>
          <Typography>{new Date(drive.date).toLocaleDateString()}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Available Doses</Typography>
          <Typography>{drive.availableDoses}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Status</Typography>
          <Chip
            label={drive.status}
            color={
              drive.status === 'scheduled' ? 'primary' :
              drive.status === 'completed' ? 'success' : 'default'
            }
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">Applicable Classes</Typography>
          <Box sx={{ mt: 1 }}>
            {drive.applicableClasses.map((grade) => (
              <Chip
                key={grade}
                label={`Grade ${grade}`}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [viewDrive, setViewDrive] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const { data } = await vaccinationDrives.getAll();
      setDrives(data);
    } catch (err) {
      setError('Failed to fetch vaccination drives');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedDrive) {
        await vaccinationDrives.update(selectedDrive._id, formData);
      } else {
        await vaccinationDrives.create(formData);
      }
      setFormOpen(false);
      setSelectedDrive(null);
      fetchDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vaccination drive');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    
    try {
      await vaccinationDrives.delete(id);
      fetchDrives();
    } catch (err) {
      setError('Failed to delete vaccination drive');
    }
  };

  const isDriveEditable = (drive) => {
    return drive.status === 'scheduled' && new Date(drive.date) > new Date();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Vaccination Drives</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Schedule New Drive
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vaccine Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Available Doses</TableCell>
              <TableCell>Applicable Classes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drives.map((drive) => (
              <TableRow key={drive._id}>
                <TableCell>{drive.vaccineName}</TableCell>
                <TableCell>
                  {new Date(drive.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{drive.availableDoses}</TableCell>
                <TableCell>
                  {drive.applicableClasses.map((grade) => (
                    <Chip
                      key={grade}
                      label={`Grade ${grade}`}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={drive.status}
                    color={
                      drive.status === 'scheduled' ? 'primary' :
                      drive.status === 'completed' ? 'success' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => setViewDrive(drive)}
                    size="small"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedDrive(drive);
                      setFormOpen(true);
                    }}
                    disabled={!isDriveEditable(drive)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(drive._id)}
                    disabled={!isDriveEditable(drive)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <VaccinationDriveForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedDrive(null);
        }}
        onSubmit={handleSubmit}
        drive={selectedDrive}
      />

      {viewDrive && (
        <DriveDetails
          drive={viewDrive}
          onClose={() => setViewDrive(null)}
        />
      )}
    </Box>
  );
};

export default VaccinationDrives; 