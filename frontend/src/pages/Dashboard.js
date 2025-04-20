import { Box, Typography, Grid, Paper } from '@mui/material';
import Stats from '../components/dashboard/Stats';
import UpcomingDrives from '../components/dashboard/UpcomingDrives';

const Dashboard = () => {
  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      pt: { xs: 3, sm: 4, md: 5 }
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: { xs: 3, sm: 4, md: 5 },
          background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          pb: 2
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              borderRadius: 3
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 3,
                color: 'primary.main',
                fontWeight: 'medium'
              }}
            >
              Overview
            </Typography>
            <Stats />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              borderRadius: 3
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 3,
                color: 'primary.main',
                fontWeight: 'medium'
              }}
            >
              Upcoming Vaccination Drives
            </Typography>
            <UpcomingDrives />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 