import { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import { students } from '../../services/api';

const AVAILABLE_CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const StudentForm = ({ open, onClose, student = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    class: '',
    dateOfBirth: '',
    parentName: '',
    contactNumber: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        name: student?.name || '',
        studentId: student?.studentId || '',
        class: student?.class || '',
        dateOfBirth: student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        parentName: student?.parentName || '',
        contactNumber: student?.contactNumber || ''
      });
    }
  }, [open, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        class: formData.class,
        dateOfBirth: formData.dateOfBirth,
        parentName: formData.parentName.trim(),
        contactNumber: formData.contactNumber.trim()
      };

      if (student) {
        await students.update(student._id, payload);
      } else {
        const response = await students.create(payload);
        if (response.status !== 201) {
          throw new Error(`Unexpected status: ${response.status}`);
        }
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (err.response?.data?.errors) {
        const newFieldErrors = {};
        err.response.data.errors.forEach(error => {
          newFieldErrors[error.field] = error.message;
        });
        setFieldErrors(newFieldErrors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Failed to save student');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {student ? 'Edit Student' : 'Add New Student'}
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
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student ID"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                error={!!fieldErrors.studentId}
                helperText={fieldErrors.studentId}
                required
                disabled={!!student}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!fieldErrors.class}>
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  label="Class"
                >
                  {AVAILABLE_CLASSES.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      Grade {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                error={!!fieldErrors.dateOfBirth}
                helperText={fieldErrors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Parent/Guardian Name"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                error={!!fieldErrors.parentName}
                helperText={fieldErrors.parentName}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                error={!!fieldErrors.contactNumber}
                helperText={fieldErrors.contactNumber}
                required
              />
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
            {loading ? 'Saving...' : (student ? 'Update' : 'Add')} Student
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentForm; 