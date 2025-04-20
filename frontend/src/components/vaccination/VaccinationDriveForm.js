import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const VaccinationDriveForm = ({ open, onClose, onSubmit, drive = null }) => {
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: null,
    availableDoses: '',
    applicableClasses: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form data when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        vaccineName: drive?.vaccineName || '',
        date: drive?.date ? new Date(drive.date) : null,
        availableDoses: drive?.availableDoses || '',
        applicableClasses: drive?.applicableClasses || []
      });
    }
  }, [open, drive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validations
    if (!formData.vaccineName || !formData.date || !formData.availableDoses) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (formData.applicableClasses.length === 0) {
      setError('Please select at least one applicable class');
      setLoading(false);
      return;
    }

    if (formData.availableDoses < 1) {
      setError('Number of doses must be at least 1');
      setLoading(false);
      return;
    }

    const minDate = addDays(new Date(), 15);
    if (formData.date < minDate) {
      setError('Drive must be scheduled at least 15 days in advance');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      // Display the error message from the backend
      setError(err.response?.data?.message || 'Failed to save vaccination drive');
      console.error('Error saving drive:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassToggle = (grade) => {
    const classes = formData.applicableClasses.includes(grade)
      ? formData.applicableClasses.filter(c => c !== grade)
      : [...formData.applicableClasses, grade];
    
    setFormData({ ...formData, applicableClasses: classes });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {drive ? 'Edit Vaccination Drive' : 'Schedule New Vaccination Drive'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vaccine Name"
                value={formData.vaccineName}
                onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Drive Date"
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                minDate={addDays(new Date(), 15)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Available Doses"
                value={formData.availableDoses}
                onChange={(e) => setFormData({ ...formData, availableDoses: parseInt(e.target.value) })}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1 }}>Applicable Classes</InputLabel>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {GRADES.map((grade) => (
                  <Chip
                    key={grade}
                    label={`Grade ${grade}`}
                    onClick={() => handleClassToggle(grade)}
                    color={formData.applicableClasses.includes(grade) ? 'primary' : 'default'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : (drive ? 'Update' : 'Schedule')} Drive
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VaccinationDriveForm; 