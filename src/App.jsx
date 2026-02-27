import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import RegistrationWizard from './pages/Onboarding/RegistrationWizard';
import StatusPending from './pages/Onboarding/StatusPending';
import DashboardLayout from './components/layout/DashboardLayout';
import OverviewPage from './pages/Dashboard/OverviewPage';
import EmptyOverviewPage from './pages/Dashboard/EmptyOverviewPage';
import JobPostingPage from './pages/Dashboard/JobPostingPage';
import CandidatesPage from './pages/Dashboard/CandidatesPage';
import ComingSoonResumeBank from './pages/Dashboard/ComingSoonResumeBank';
import SubscriptionPage from './pages/Dashboard/SubscriptionPage';
import SupportPage from './pages/Dashboard/SupportPage';
import ProfilePage from './pages/Dashboard/ProfilePage';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegistrationWizard />} />
      <Route path="/under-review" element={<StatusPending />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
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
