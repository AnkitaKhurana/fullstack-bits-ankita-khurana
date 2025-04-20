import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  TextField
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { students, vaccinationDrives } from '../../services/api';
import { useRefresh } from '../../context/RefreshContext';

const VaccinationReport = () => {
  const { refreshTrigger } = useRefresh();
  const [studentData, setStudentData] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [vaccinationStatus, setVaccinationStatus] = useState('all');

  const fetchVaccines = useCallback(async () => {
    try {
      const { data } = await vaccinationDrives.getAll();
      const uniqueVaccines = [...new Set(data.map(drive => drive.vaccineName))];
      setVaccines(uniqueVaccines);
    } catch (err) {
      console.error('Failed to fetch vaccines:', err);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching students with params:', {
        page: page + 1,
        limit: rowsPerPage,
        vaccine: selectedVaccine,
        search: searchTerm,
        vaccinationStatus
      });

      const { data } = await students.getAll({
        page: page + 1,
        limit: rowsPerPage,
        vaccine: selectedVaccine === 'all' ? '' : selectedVaccine,
        search: searchTerm,
        vaccinationStatus: vaccinationStatus === 'all' ? '' : vaccinationStatus
      });

      console.log('Received student data:', data);
      setStudentData(data.students);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, selectedVaccine, searchTerm, vaccinationStatus]);

  useEffect(() => {
    console.log('Refresh trigger changed:', refreshTrigger);
    fetchVaccines();
    fetchStudents();
  }, [fetchVaccines, fetchStudents, refreshTrigger]);

  const handleDownloadReport = async () => {
    try {
      const response = await students.downloadReport({
        vaccine: selectedVaccine === 'all' ? '' : selectedVaccine,
        search: searchTerm,
        vaccinationStatus: vaccinationStatus === 'all' ? '' : vaccinationStatus
      });

      // Check if response has data
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Create a blob from the CSV text
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vaccination-report-${new Date().toISOString().split('T')[0]}.csv`);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
      console.error('Response:', err.response);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Vaccination Report
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Students"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Vaccination Status</InputLabel>
                <Select
                  value={vaccinationStatus}
                  onChange={(e) => setVaccinationStatus(e.target.value)}
                  label="Vaccination Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="vaccinated">Vaccinated</MenuItem>
                  <MenuItem value="unvaccinated">Not Vaccinated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Vaccine</InputLabel>
                <Select
                  value={selectedVaccine}
                  onChange={(e) => setSelectedVaccine(e.target.value)}
                  label="Filter by Vaccine"
                >
                  <MenuItem value="all">All Vaccines</MenuItem>
                  {vaccines.map((vaccine) => (
                    <MenuItem key={vaccine} value={vaccine}>
                      {vaccine}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadReport}
              >
                Download Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Vaccine</TableCell>
              <TableCell>Vaccination Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>Grade {student.class}</TableCell>
                <TableCell>
                  {student.vaccinations?.[0]?.vaccineName || 'Not Vaccinated'}
                </TableCell>
                <TableCell>
                  {student.vaccinations?.[0]?.date 
                    ? new Date(student.vaccinations[0].date).toLocaleDateString()
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <Chip
                    label={student.vaccinations?.length ? 'Vaccinated' : 'Not Vaccinated'}
                    color={student.vaccinations?.length ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default VaccinationReport; 