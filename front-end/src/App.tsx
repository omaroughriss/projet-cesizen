import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Questionnaire from "./pages/Questionnaire";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin pages
import Admin from "./pages/admin/Admin";
import UsersManagement from "./pages/admin/UsersManagement";
import ArticlesManagement from "./pages/admin/ArticlesManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import StressQuestionnaireManagement from "./pages/admin/StressQuestionnaireManagement";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes protégées */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Routes admin protégées */}
            <Route path="/admin" element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute>
                <UsersManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/articles" element={
              <PrivateRoute>
                <ArticlesManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/categories" element={
              <PrivateRoute>
                <CategoriesManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/stress-questionnaire" element={
              <PrivateRoute>
                <StressQuestionnaireManagement />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
