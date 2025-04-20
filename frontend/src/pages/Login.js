import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await auth.login(credentials);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100'
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            School Vaccination Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Login to access the dashboard
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={credentials.username}
              onChange={(e) => setCredentials({
                ...credentials,
                username: e.target.value
              })}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 