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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Fade,
  Stack,
  Divider,
  Button,
  TablePagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Vaccines as VaccineIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { students } from '../../services/api';
import StudentForm from './StudentForm';
import BulkImportDialog from './BulkImportDialog';
import VaccinationDialog from './VaccinationDialog';
import { useRefresh } from '../../context/RefreshContext';

const StudentList = () => {
  const { triggerRefresh } = useRefresh();
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterVaccination, setFilterVaccination] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [vaccinationOpen, setVaccinationOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await students.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        class: filterClass,
        vaccinationStatus: filterVaccination
      });
      console.log('Fetched students:', data);
      setStudentList(data.students);
      setTotal(data.pagination.total);
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, searchTerm, filterClass, filterVaccination, triggerRefresh]);

  const handleEdit = (student) => {
    setSelectedStudent(student);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await students.delete(studentId);
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
    }
  };

  const handleStudentSaved = async () => {
    try {
      // Fetch the latest data with current filters
      const { data } = await students.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        class: filterClass,
        vaccinationStatus: filterVaccination
      });
      setStudentList(data.students);
      setTotal(data.pagination.total);
      
      // Close form and reset selection
      setFormOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error refreshing student list:', err);
      setError('Failed to refresh student list');
    }
  };

  const handleDownloadReport = async () => {
    try {
      setLoading(true);
      const response = await students.downloadReport({
        search: searchTerm,
        class: filterClass,
        vaccinationStatus: filterVaccination
      });

      // Create a blob from the CSV text
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_report.csv');
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => setFormOpen(true)}
          startIcon={<AddIcon />}
        >
          Add Student
        </Button>
        <Button
          variant="contained"
          onClick={() => setBulkImportOpen(true)}
          startIcon={<UploadIcon />}
        >
          Bulk Import
        </Button>
      </Box>

      <Fade in={true}>
        <Box sx={{ p: 3 }}>
          <Card sx={{ mb: 4, p: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search students"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or ID"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Filter by Class</InputLabel>
                    <Select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      label="Filter by Class"
                    >
                      <MenuItem value="">All Classes</MenuItem>
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i + 1} value={String(i + 1)}>
                          Grade {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Vaccination Status</InputLabel>
                    <Select
                      value={filterVaccination}
                      onChange={(e) => setFilterVaccination(e.target.value)}
                      label="Vaccination Status"
                    >
                      <MenuItem value="">All Students</MenuItem>
                      <MenuItem value="vaccinated">Vaccinated</MenuItem>
                      <MenuItem value="unvaccinated">Not Vaccinated</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vaccination Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Stack spacing={2} alignItems="center">
                          <Typography variant="h6" color="text.secondary">
                            No students found
                          </Typography>
                          <Typography color="text.secondary">
                            Try adjusting your search or filters
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentList.map((student) => (
                      <TableRow 
                        key={student._id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(156, 39, 176, 0.04)' 
                          } 
                        }}
                      >
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`Grade ${student.class}`}
                            size="small"
                            sx={{ 
                              backgroundColor: 'secondary.light',
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={student.vaccinations?.length ? <CheckCircleIcon /> : <CancelIcon />}
                            label={student.vaccinations?.length ? 'Vaccinated' : 'Not Vaccinated'}
                            color={student.vaccinations?.length ? 'success' : 'default'}
                            size="small"
                            sx={{
                              '& .MuiChip-icon': {
                                color: 'inherit'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton 
                              size="small"
                              onClick={() => handleEdit(student)}
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { 
                                  backgroundColor: 'rgba(156, 39, 176, 0.08)' 
                                } 
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => handleDelete(student._id)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { 
                                  backgroundColor: 'rgba(244, 67, 54, 0.08)' 
                                } 
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setSelectedStudent(student);
                                setVaccinationOpen(true);
                              }}
                              disabled={student.vaccinations?.length > 0}
                            >
                              <VaccineIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </TableContainer>
          </Card>

          <StudentForm
            open={formOpen || !!selectedStudent}
            student={selectedStudent}
            onClose={() => {
              setFormOpen(false);
              setSelectedStudent(null);
            }}
            onSuccess={handleStudentSaved}
          />
        </Box>
      </Fade>

      <BulkImportDialog
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onSuccess={() => {
          setBulkImportOpen(false);
          fetchStudents();
        }}
      />

      {selectedStudent && (
        <VaccinationDialog
          open={vaccinationOpen}
          onClose={() => {
            setVaccinationOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          onSuccess={() => {
            setVaccinationOpen(false);
            setSelectedStudent(null);
            fetchStudents();
            triggerRefresh();
          }}
        />
      )}
    </Box>
  );
};

export default StudentList; 