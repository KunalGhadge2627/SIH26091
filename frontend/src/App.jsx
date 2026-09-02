import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AssessmentWizard from './pages/AssessmentWizard';
import FeasibilityReport from './pages/FeasibilityReport';
import ImprovementPlanPage from './pages/ImprovementPlanPage';
import BusinessAlternativesPage from './pages/BusinessAlternativesPage';
import FinancialPlanPage from './pages/FinancialPlanPage';
import ReportsHistoryPage from './pages/ReportsHistoryPage';
import LegalAdvicePage from './pages/LegalAdvicePage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xs font-semibold text-gray-500">
        Loading Udyam Gram...
      </div>
    );
  }

  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Authenticated Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment/new"
        element={
          <ProtectedRoute>
            <AssessmentWizard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments/:id/report"
        element={
          <ProtectedRoute>
            <FeasibilityReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/improvement-plan"
        element={
          <ProtectedRoute>
            <ImprovementPlanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alternatives"
        element={
          <ProtectedRoute>
            <BusinessAlternativesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/financial-plan"
        element={
          <ProtectedRoute>
            <FinancialPlanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/legal-advice"
        element={
          <ProtectedRoute>
            <LegalAdvicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
