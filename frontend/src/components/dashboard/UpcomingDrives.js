import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { vaccinationDrives } from '../../services/api';

const UpcomingDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const { data } = await vaccinationDrives.getAll({ upcoming: true });
        setDrives(data);
      } catch (err) {
        setError('Failed to load upcoming drives');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (drives.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography color="text.secondary">
          No upcoming vaccination drives scheduled
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upcoming Vaccination Drives
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vaccine Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Available Doses</TableCell>
            <TableCell>Applicable Classes</TableCell>
            <TableCell>Status</TableCell>
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
                  color={drive.status === 'scheduled' ? 'primary' : 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UpcomingDrives; 