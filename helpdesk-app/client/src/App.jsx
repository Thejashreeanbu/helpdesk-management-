import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './shared/components/MainLayout';
import PrivateRoute from './shared/components/PrivateRoute';
import RoleRoute from './shared/components/RoleRoute';

// Pages
import LoginPage from './modules/auth/pages/LoginPage';
import StaffLoginPage from './modules/auth/pages/StaffLoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';

// Tickets Module
import DashboardPage from './modules/tickets/pages/DashboardPage';
import TicketsPage from './modules/tickets/pages/TicketsPage';
import CreateTicketPage from './modules/tickets/pages/CreateTicketPage';
import TicketDetailsPage from './modules/tickets/pages/TicketDetailsPage';

// Users Module
import UsersPage from './modules/users/pages/UsersPage';
import ProfilePage from './modules/users/pages/ProfilePage';
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';
import TwoFactorVerificationPage from './modules/auth/pages/TwoFactorVerificationPage';
import EmailVerificationPage from './modules/auth/pages/EmailVerificationPage';
import AccessGrantedPage from './modules/auth/pages/AccessGrantedPage';

// Knowledge Base Module
import KnowledgeBasePage from './modules/knowledgeBase/pages/KnowledgeBasePage';
import ArticleListPage from './modules/knowledgeBase/pages/ArticleListPage';
import ArticleDetailsPage from './modules/knowledgeBase/pages/ArticleDetailsPage';
import ManageKnowledgeBase from './modules/knowledgeBase/pages/ManageKnowledgeBase';
import ArticleEditorPage from './modules/knowledgeBase/pages/ArticleEditorPage';

// Reports Module
import ReportsDashboard from './modules/reports/pages/ReportsDashboard';

import NotFoundPage from './shared/components/NotFoundPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/staff/login" element={<StaffLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
        <Route path="/verify-2fa" element={<TwoFactorVerificationPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/access-granted" element={<AccessGrantedPage />} />

        {/* Global Layout (Public & Private) */}
        <Route path="/" element={<MainLayout />}>
          {/* Knowledge Base (Publicly Accessible) */}
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="knowledge-base/category/:categoryId" element={<ArticleListPage />} />
          <Route path="knowledge-base/search" element={<ArticleListPage />} />
          <Route path="knowledge-base/article/:id" element={<ArticleDetailsPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="tickets" element={<TicketsPage />} />

            <Route element={<RoleRoute allowedRoles={['user', 'admin', 'super-admin']} />}>
              <Route path="new-ticket" element={<CreateTicketPage />} />
            </Route>

            <Route path="ticket/:ticketId" element={<TicketDetailsPage />} />

            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Knowledge Base Management (Private) */}
            <Route path="knowledge-base/manage" element={<ManageKnowledgeBase />} />
            <Route path="knowledge-base/create" element={<ArticleEditorPage />} />
            <Route path="knowledge-base/edit/:id" element={<ArticleEditorPage />} />

            {/* Report - Protected */}
            <Route element={<RoleRoute allowedRoles={['admin', 'manager', 'super-admin']} />}>
              <Route path="reports" element={<ReportsDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
