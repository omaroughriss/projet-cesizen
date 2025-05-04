
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/articles" element={<ArticlesManagement />} />
          <Route path="/admin/categories" element={<CategoriesManagement />} />
          <Route path="/admin/stress-questionnaire" element={<StressQuestionnaireManagement />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
