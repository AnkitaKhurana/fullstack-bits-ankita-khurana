import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { students } from '../../services/api';

const BulkImportDialog = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile?.type !== 'text/csv') {
      setError('Please upload a CSV file');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await students.bulkImport(file);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk Import Students</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="csv-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Choose CSV File
            </Button>
          </label>
          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}
        </Box>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleUpload}
          variant="contained"
          disabled={!file || loading}
        >
          {loading ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkImportDialog; 