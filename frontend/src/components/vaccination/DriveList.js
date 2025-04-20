import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TextField,
  CircularProgress,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { vaccinationDrives } from '../../services/api';
import DriveForm from './DriveForm';

const DriveList = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const { data } = await vaccinationDrives.getAll();
      setDrives(data);
    } catch (err) {
      setError('Failed to load vaccination drives');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrives = drives.filter(drive => 
    drive.vaccineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEdit = (drive) => {
    setSelectedDrive(drive);
  };

  const handleDelete = async (driveId) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) {
      return;
    }

    try {
      await vaccinationDrives.delete(driveId);
      fetchDrives();
    } catch (err) {
      setError('Failed to delete drive');
      console.error(err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Search drives"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
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
            {filteredDrives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No vaccination drives found
                </TableCell>
              </TableRow>
            ) : (
              filteredDrives.map((drive) => (
                <TableRow key={drive._id}>
                  <TableCell>{drive.vaccineName}</TableCell>
                  <TableCell>
                    {new Date(drive.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{drive.availableDoses}</TableCell>
                  <TableCell>
                    {drive.applicableClasses.map((className) => (
                      <Chip
                        key={className}
                        label={className}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={drive.status}
                      color={getStatusColor(drive.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      disabled={drive.status !== 'scheduled'}
                      onClick={() => handleEdit(drive)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      disabled={drive.status !== 'scheduled'}
                      onClick={() => handleDelete(drive._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedDrive && (
        <DriveForm
          open={true}
          drive={selectedDrive}
          onClose={() => setSelectedDrive(null)}
          onSuccess={() => {
            setSelectedDrive(null);
            fetchDrives();
          }}
        />
      )}
    </Box>
  );
};

export default DriveList; 