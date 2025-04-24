import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './features/login/Login'; 
import './App.css';

function AppContent() {
  const { user } = useAuth();
  return user ? <Home /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
