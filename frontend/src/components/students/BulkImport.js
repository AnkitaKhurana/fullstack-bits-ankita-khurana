import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

const BulkImport = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bulk Import Students</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography gutterBottom>
            Upload a CSV file with student details
          </Typography>
          <input
            type="file"
            accept=".csv"
            style={{ display: 'block', marginTop: '1rem' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkImport; 