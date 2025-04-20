import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import VaccinationDrives from './pages/VaccinationDrives';
import DashboardLayout from './components/layout/DashboardLayout';
import { theme } from './theme';
import Reports from './pages/Reports';
import ErrorBoundary from './components/common/ErrorBoundary';
import { RefreshProvider } from './context/RefreshContext';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ErrorBoundary>
          <AuthProvider>
            <RefreshProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <DashboardLayout />
                      </PrivateRoute>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="students" element={<Students />} />
                    <Route path="vaccination-drives" element={<VaccinationDrives />} />
                    <Route path="reports" element={<Reports />} />
                    <Route index element={<Navigate to="/dashboard" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </RefreshProvider>
          </AuthProvider>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App; 