import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Container,
  AppBar,
  Toolbar
} from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </AppBar>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          pt: { xs: 10, sm: 12 }
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 