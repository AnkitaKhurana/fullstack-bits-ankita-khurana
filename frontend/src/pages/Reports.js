import { useState } from 'react';
import { Box } from '@mui/material';
import VaccinationReport from '../components/reports/VaccinationReport';

const Reports = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Box>
      <VaccinationReport refreshTrigger={refreshTrigger} />
    </Box>
  );
};

export default Reports; 