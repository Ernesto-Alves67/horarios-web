import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DailyScreen from './screens/DailyScreen';
import WeeklyScreen from './screens/WeeklyScreen';
import StatusScreen from './screens/StatusScreen';
import ApiService from './services/api';
import LocalStorageHelper from './services/localStorage';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inicializa a aplicação
    const initializeApp = async () => {
      try {
        // Verifica se já tem token
        const existingToken = LocalStorageHelper.getAccessToken();
        
        if (!existingToken) {
          // Se não tem token, tenta buscar um novo
          try {
            const authResponse = await ApiService.initAuth();
            if (authResponse && authResponse.accessToken) {
              LocalStorageHelper.setAccessToken(authResponse.accessToken);
            }
          } catch (apiError) {
            // Se falhar na API, continua sem token (modo offline)
            console.warn('Running in offline mode without API token');
          }
        }
        //espera 2 segundos para simular loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        // Continua mesmo com erro
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#018786',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        gap: '20px'
      }}>
        <div style={{ 
          borderRadius: '35%',
          padding: '50px',
          backgroundColor: '#ffffff', 
          alignItems: 'center',
          display: 'flex',
        }}>
            <img src="/ic_logo_ufcat.svg" alt="Logo da UFCAT" style={{ height: '120px', width: '120px', objectFit: 'contain' }} />
          
          </div>
          <h2 style={{ margin: 0 }}>Horários</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        color: '#1C1C1C',
        fontSize: '18px',
        textAlign: 'center',
        padding: '20px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/daily" replace />} />
            <Route path="daily" element={<DailyScreen />} />
            <Route path="weekly" element={<WeeklyScreen />} />
            <Route path="status" element={<StatusScreen />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
