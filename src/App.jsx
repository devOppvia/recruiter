import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import RegistrationWizard from "./pages/Onboarding/RegistrationWizard";
import StatusPending from "./pages/Onboarding/StatusPending";
import DashboardLayout from "./components/layout/DashboardLayout";
import OverviewPage from "./pages/Dashboard/OverviewPage";
import EmptyOverviewPage from "./pages/Dashboard/EmptyOverviewPage";
import JobPostingPage from "./pages/Dashboard/JobPostingPage";
import CandidatesPage from "./pages/Dashboard/CandidatesPage";
import ComingSoonResumeBank from "./pages/Dashboard/ComingSoonResumeBank";
import SubscriptionPage from "./pages/Dashboard/SubscriptionPage";
import SupportPage from "./pages/Dashboard/SupportPage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import ForgotPassword from "./pages/Auth/ForgotPassword";

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegistrationWizard />
          </PublicRoute>
        }
      />
      <Route
        path="/under-review"
        element={
          <PublicRoute>
            <StatusPending />
          </PublicRoute>
        }
      />

      {/* Dashboard Routes */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="overview-empty" element={<EmptyOverviewPage />} />
        <Route path="jobs" element={<JobPostingPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="resume-bank" element={<ComingSoonResumeBank />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
