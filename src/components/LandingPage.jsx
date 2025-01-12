import React from 'react';
    import { Link } from 'react-router-dom';

    function LandingPage() {
      return (
        <div className="container">
          <h1>Welcome to Pharmacy App</h1>
          <p>Get competitive prices from nearby pharmacies.</p>
          <div>
            <Link to="/customer-registration" className="btn">Register as Customer</Link>
            <Link to="/pharmacy-registration" className="btn" style={{ marginLeft: '10px' }}>Register as Pharmacy</Link>
            <Link to="/login" className="btn" style={{ marginLeft: '10px' }}>Login</Link>
          </div>
        </div>
      );
    }

    export default LandingPage;
