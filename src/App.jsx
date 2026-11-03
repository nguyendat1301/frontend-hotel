// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import AppRoutes from './routes';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ChatbotWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
