import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import Onboarding from './pages/Onboarding';
import SidebarLayout from './components/SidebarLayout';
import Exercises from './pages/Exercises';
import WeeklyPlans from './pages/WeeklyPlans';
import ActiveWorkout from './pages/ActiveWorkout';
import ProgressNutrition from './pages/ProgressNutrition';

// Route Guard Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading System...</div>;
  
  if (!currentUser) return <Navigate to="/login" replace />;

  // Force onboarding if profile is not complete
  if (userProfile && !userProfile.isprofilecomplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Specifically for Onboarding (only accessible if logged in but incomplete)
const OnboardingRoute = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();
  
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userProfile && userProfile.isprofilecomplete) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Semi-Protected Route (Logged in, Incomplete Profile) */}
          <Route path="/onboarding" element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          } />

          {/* Fully Protected Routes (Using Sidebar Layout) */}
          <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/weekly-plans" element={<WeeklyPlans />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/workout" element={<ActiveWorkout />} />
            <Route path="/nutrition" element={<ProgressNutrition />} />
            <Route path="/chat" element={<AIChat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
