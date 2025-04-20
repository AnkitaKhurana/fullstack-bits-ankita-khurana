import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { students, vaccinationDrives } from '../../services/api';

const VaccinationDialog = ({ open, onClose, student, onSuccess }) => {
  const [selectedDrive, setSelectedDrive] = useState('');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDrives, setFetchingDrives] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrives = async () => {
      if (!open || !student) return;
      
      try {
        setFetchingDrives(true);
        setError('');
        const { data } = await vaccinationDrives.getAll();
        console.log('Fetched drives:', data);
        
        // Filter drives applicable to student's class
        const applicableDrives = data.filter(drive => 
          drive.applicableClasses.includes(student.class) && 
          drive.availableDoses > 0
        );
        console.log('Applicable drives:', applicableDrives);
        
        setDrives(applicableDrives);
      } catch (err) {
        console.error('Error fetching drives:', err);
        setError('Failed to load vaccination drives');
      } finally {
        setFetchingDrives(false);
      }
    };

    fetchDrives();
  }, [open, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDrive) {
      setError('Please select a vaccination drive');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('Submitting vaccination:', {
        studentId: student._id,
        driveId: selectedDrive
      });
      
      await students.vaccinate(student._id, selectedDrive);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Vaccination error:', err);
      setError(err.response?.data?.message || 'Failed to mark vaccination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mark Vaccination</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {fetchingDrives ? (
            <CircularProgress />
          ) : drives.length === 0 ? (
            <Alert severity="info">
              No vaccination drives available for this student's class
            </Alert>
          ) : (
            <FormControl fullWidth required>
              <InputLabel>Select Vaccination Drive</InputLabel>
              <Select
                value={selectedDrive}
                onChange={(e) => setSelectedDrive(e.target.value)}
                label="Select Vaccination Drive"
              >
                {drives.map((drive) => (
                  <MenuItem key={drive._id} value={drive._id}>
                    {drive.vaccineName} - {new Date(drive.date).toLocaleDateString()} 
                    ({drive.availableDoses} doses available)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !selectedDrive || drives.length === 0}
          >
            {loading ? 'Marking...' : 'Mark as Vaccinated'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VaccinationDialog; 