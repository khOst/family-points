import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { Tasks } from './pages/Tasks';
import { Wishlist } from './pages/Wishlist';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { TransactionHistory } from './pages/TransactionHistory';
import { useAuthStore } from './stores/authStore';
import { LoadingState, ErrorBoundary } from './components/ui';

function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="groups" element={<Groups />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transactions" element={<TransactionHistory />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : isLoading ? (
            <Route path="*" element={
              <div className="min-h-screen bg-gray-25 flex items-center justify-center">
                <LoadingState message="Loading Family Points..." size="lg" />
              </div>
            } />
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
