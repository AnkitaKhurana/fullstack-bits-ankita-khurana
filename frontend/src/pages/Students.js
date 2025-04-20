import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from '@mui/material';
import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';
import BulkImport from '../components/students/BulkImport';
import VaccinationReport from '../components/reports/VaccinationReport';

const Students = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStudentSaved = () => {
    setIsFormOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Students</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => setIsBulkImportOpen(true)}
          >
            Bulk Import
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsFormOpen(true)}
          >
            Add Student
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2 }}>
        <StudentList 
          refreshTrigger={refreshTrigger} 
          onVaccinationSuccess={handleRefresh}
        />
      </Paper>

      <StudentForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleStudentSaved}
      />
      
      <BulkImport
        open={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />

      <VaccinationReport refreshTrigger={refreshTrigger} />
    </Box>
  );
};

export default Students; 