import React, { useState, useEffect } from 'react';
    import {  Route, Routes, useNavigate } from 'react-router-dom';
    import LandingPage from './components/LandingPage';
    import CustomerRegistration from './components/CustomerRegistration';
    import PharmacyRegistration from './components/PharmacyRegistration';
    import CustomerDashboard from './components/CustomerDashboard';
    import PharmacyDashboard from './components/PharmacyDashboard';
    import Login from './components/Login';

    function App() {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const navigate = useNavigate();
      const [userType, setUserType] = useState(null);

      useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUserType = localStorage.getItem('userType');
        if (storedAuth === 'true') {
          setIsAuthenticated(true);
          setUserType(storedUserType);
        }
      }, []);

      const handleLogin = (type) => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', type);
        setUserType(type);
        if (type === 'pharmacy') {
          navigate('/pharmacy-dashboard');
        } else {
          navigate('/customer-dashboard');
        }
      };

      const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userType');
        setUserType(null);
        navigate('/');
      };

      return (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/customer-registration" element={<CustomerRegistration />} />
            <Route path="/pharmacy-registration" element={<PharmacyRegistration />} />
            <Route path="/customer-dashboard" element={isAuthenticated && userType !== 'pharmacy' ? <CustomerDashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
            <Route path="/pharmacy-dashboard" element={isAuthenticated && userType === 'pharmacy' ? <PharmacyDashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
          </Routes>
      );
    }

    export default App;
