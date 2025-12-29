import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Sidebar, MobileNav } from './components/Sidebar';
import { ProjectListDialog } from './components/ProjectListDialog';
import { SettingsModal } from './components/SettingsModal';
import { SupportModal } from './components/SupportModal';
import { MISSING_API_KEY_ERROR } from './services/geminiService';
import { AlertCircle, X } from 'lucide-react';

// Pages
import { IdeaPage } from './pages/IdeaPage';
import { ResearchPage } from './pages/ResearchPage';
import { PrdPage } from './pages/PrdPage';
import { RealizationPage } from './pages/RealizationPage';

// --- Layout ---
const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    error,
    clearError,
    showProjectList,
    openProjectList,
    closeProjectList,
    state,
    showSettings,
    openSettings,
    closeSettings
  } = useProject();
  const [showSupport, setShowSupport] = useState(false);

  // Api Key Check Check (Global)
  if (MISSING_API_KEY_ERROR) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white p-4 text-center">
        <div className="max-w-md bg-gray-800 p-8 rounded-xl border border-red-500/50">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Configuration Error</h2>
          <p className="text-gray-400 mb-4">
            The API Key is missing. Please set <code className="bg-black/50 px-2 py-1 rounded text-orange-400">VITE_API_KEY</code> in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-forge-900 text-forge-text selection:bg-orange-100 selection:text-orange-900">
      <Header
        onOpenProjectList={openProjectList}
        onOpenSettings={openSettings}
      />

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-red-500/10 border border-red-500/50 backdrop-blur-md text-red-500 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm font-medium">{error}</div>
          <button onClick={clearError} className="hover:bg-red-500/10 p-1 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}


      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
          onOpenSupport={() => setShowSupport(true)}
        />

        {/* Mobile Navigation (Bottom) */}
        <MobileNav
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden bg-forge-50 dark:bg-forge-900 transition-colors">
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showProjectList && <ProjectListDialog onClose={closeProjectList} />}
      {showSettings && <SettingsModal isOpen={showSettings} onClose={closeSettings} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
};


// --- App Root & Provider ---

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <HashRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<IdeaPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/prd" element={<PrdPage />} />
                <Route path="/realization" element={<RealizationPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </HashRouter>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;