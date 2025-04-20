import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Vaccines as VaccinesIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/dashboard',
      icon: <DashboardIcon />,
      text: 'Dashboard'
    },
    {
      path: '/students',
      icon: <PeopleIcon />,
      text: 'Students'
    },
    {
      path: '/vaccination-drives',
      icon: <VaccinesIcon />,
      text: 'Vaccination Drives'
    },
    {
      path: '/reports',
      icon: <AssessmentIcon />,
      text: 'Reports'
    }
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100vh - 64px)'
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar; 