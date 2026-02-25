import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import './index.css';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={session ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route
            path="/dashboard"
            element={session ? <Dashboard session={session} /> : <Navigate to="/auth" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
