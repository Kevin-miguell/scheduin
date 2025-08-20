import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PostCreation from './pages/post-creation';
import ContentCalendar from './pages/content-calendar';
import AnalyticsDashboard from './pages/analytics-dashboard';
import Dashboard from './pages/dashboard';
import MediaLibrary from './pages/media-library';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* App Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-creation" element={<PostCreation />} />
        <Route path="/content-calendar" element={<ContentCalendar />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/media-library" element={<MediaLibrary />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;