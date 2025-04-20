import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { logout } = useAuth();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          School Vaccination Portal
        </Typography>
        <IconButton color="inherit" onClick={logout}>
          Logout
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 