import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    function CustomerRegistration() {
      const [email, setEmail] = useState('');
      const [phoneNumber, setPhoneNumber] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [address, setAddress] = useState('');
      const [postcode, setPostcode] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        localStorage.setItem('user', JSON.stringify({ email, phoneNumber, password, address, postcode, userType: 'customer' }));
        navigate('/login');
      };

      return (
        <div className="container">
          <h2>Customer Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Postcode</label>
              <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn">Register</button>
          </form>
        </div>
      );
    }

    export default CustomerRegistration;
