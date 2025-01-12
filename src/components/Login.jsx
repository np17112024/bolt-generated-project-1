import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    function Login({ onLogin }) {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();

      const handleSubmit = (e) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        const storedPharmacy = localStorage.getItem('pharmacy');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.email === email && user.password === password) {
            onLogin('customer');
            return;
          }
        }
        if (storedPharmacy) {
          const pharmacy = JSON.parse(storedPharmacy);
          if (pharmacy.email === email && pharmacy.password === password) {
            onLogin('pharmacy');
            return;
          }
        }
        setError('Invalid email or password');
      };

      return (
        <div className="container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      );
    }

    export default Login;
