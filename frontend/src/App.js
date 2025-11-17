import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeDummyData } from './utils/dataManager';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MyTicketPage from './pages/MyTicketPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileUserPage from './pages/ProfileUserPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Initialize dummy data on first load
initializeDummyData();

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/my-ticket" element={<MyTicketPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfileUserPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
