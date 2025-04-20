import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

const LoadingOverlay = ({ message = 'Loading...' }) => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }}
    open={true}
  >
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress color="inherit" />
      <Typography sx={{ mt: 2 }}>{message}</Typography>
    </Box>
  </Backdrop>
);

export default LoadingOverlay; 