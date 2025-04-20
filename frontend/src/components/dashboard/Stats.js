import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Fade } from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Vaccines as VaccinesIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { vaccinationDrives } from '../../services/api';

const StatCard = ({ title, value, icon, color, delay }) => (
  <Fade in={true} style={{ transitionDelay: `${delay}ms` }}>
    <Paper 
      sx={{ 
        p: 3,
        height: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box 
          sx={{ 
            backgroundColor: `${color}15`,
            p: 2,
            borderRadius: 2,
            mr: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {value}
          </Typography>
          <Typography 
            color="text.secondary" 
            variant="body1"
            sx={{ mt: 1 }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  </Fade>
);

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await vaccinationDrives.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!stats) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<PeopleIcon sx={{ color: '#2196f3' }} />}
          color="#2196f3"
          delay={0}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Vaccinated Students"
          value={stats.vaccinatedStudents}
          icon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
          color="#4caf50"
          delay={300}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Vaccination Rate"
          value={`${Math.round(stats.vaccinationRate)}%`}
          icon={<VaccinesIcon sx={{ color: '#ff9800' }} />}
          color="#ff9800"
          delay={600}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Upcoming Drives"
          value={stats.upcomingDrives}
          icon={<ScheduleIcon sx={{ color: '#f44336' }} />}
          color="#f44336"
          delay={900}
        />
      </Grid>
    </Grid>
  );
};

export default Stats; 