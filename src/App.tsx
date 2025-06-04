import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import SystemInfo from './pages/SystemInfo';
import CategoryList from './pages/CategoryList';
import CategoryDetail from './pages/CategoryDetail';
import UserManagement from './pages/UserManagement';
import ScriptGenerator from './pages/ScriptGenerator';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/system" element={<SystemInfo />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/script" element={<ScriptGenerator />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;