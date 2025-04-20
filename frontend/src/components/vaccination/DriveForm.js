import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { vaccinationDrives } from '../../services/api';

const AVAILABLE_CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const DriveForm = ({ open, onClose, drive = null, onSuccess }) => {
  const [formData, setFormData] = useState(drive || {
    vaccineName: '',
    date: null,
    availableDoses: '',
    applicableClasses: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (drive) {
        await vaccinationDrives.update(drive._id, formData);
      } else {
        await vaccinationDrives.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vaccination drive');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 15); // 15 days from now

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {drive ? 'Edit Vaccination Drive' : 'New Vaccination Drive'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vaccine Name"
                value={formData.vaccineName}
                onChange={(e) => setFormData({
                  ...formData,
                  vaccineName: e.target.value
                })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Drive Date"
                  value={formData.date}
                  onChange={(date) => setFormData({
                    ...formData,
                    date
                  })}
                  minDate={minDate}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Available Doses"
                value={formData.availableDoses}
                onChange={(e) => setFormData({
                  ...formData,
                  availableDoses: e.target.value
                })}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Applicable Classes</InputLabel>
                <Select
                  multiple
                  value={formData.applicableClasses}
                  onChange={(e) => setFormData({
                    ...formData,
                    applicableClasses: e.target.value
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={`Grade ${value}`} />
                      ))}
                    </Box>
                  )}
                  required
                >
                  {AVAILABLE_CLASSES.map((className) => (
                    <MenuItem key={className} value={className}>
                      Grade {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DriveForm; 