import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { v4 as uuidv4 } from 'uuid';

    function CustomerDashboard({ onLogout }) {
      const [user, setUser] = useState(null);
      const [prescriptions, setPrescriptions] = useState([]);
      const [selectedDistance, setSelectedDistance] = useState('1');
      const [file, setFile] = useState(null);
      const [address, setAddress] = useState('');
      const [postcode, setPostcode] = useState('');
      const [updateMessage, setUpdateMessage] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();
      const [isEditingAddress, setIsEditingAddress] = useState(false);
      const [notifications, setNotifications] = useState([]);
      const [showNotification, setShowNotification] = useState(false);

      useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setAddress(parsedUser.address);
          setPostcode(parsedUser.postcode);
        }
        fetchPrescriptions();
        fetchNotifications();
      }, []);

      const fetchPrescriptions = () => {
        const storedPrescriptions = localStorage.getItem('prescriptions');
        if (storedPrescriptions) {
          setPrescriptions(JSON.parse(storedPrescriptions));
        }
      };

      const fetchNotifications = () => {
        const storedNotifications = localStorage.getItem(`customerNotifications-${user?.email}`);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      };

      const handleDistanceChange = (e) => {
        setSelectedDistance(e.target.value);
      };

      const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };

      const handleUpload = () => {
        if (!file) {
          setError("Please select a file to upload.");
          return;
        }
        const newPrescription = {
          key: `prescriptions/${uuidv4()}-${file.name}`,
          name: file.name,
          url: URL.createObjectURL(file),
        };
        const updatedPrescriptions = [...prescriptions, newPrescription];
        setPrescriptions(updatedPrescriptions);
        localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
        setFile(null);
        notifyPharmacies(newPrescription);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      };

      const notifyPharmacies = (prescription) => {
        const storedPharmacies = localStorage.getItem('pharmacy');
        const pharmacies = storedPharmacies ? JSON.parse(storedPharmacies) : [];
        if (Array.isArray(pharmacies)) {
          pharmacies.forEach((pharmacy) => {
            const newNotification = {
              id: uuidv4(),
              type: 'prescription',
              message: `New prescription uploaded by ${user.email}`,
              prescriptionKey: prescription.key,
              timestamp: new Date().toISOString(),
            };
            const storedNotifications = localStorage.getItem(`pharmacyNotifications-${pharmacy.email}`);
            const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
            localStorage.setItem(`pharmacyNotifications-${pharmacy.email}`, JSON.stringify([...existingNotifications, newNotification]));
          });
        } else if (pharmacies) {
            const newNotification = {
              id: uuidv4(),
              type: 'prescription',
              message: `New prescription uploaded by ${user.email}`,
              prescriptionKey: prescription.key,
              timestamp: new Date().toISOString(),
            };
            const storedNotifications = localStorage.getItem(`pharmacyNotifications-${pharmacies.email}`);
            const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
            localStorage.setItem(`pharmacyNotifications-${pharmacies.email}`, JSON.stringify([...existingNotifications, newNotification]));
        }
      };

      const handleDelete = (key) => {
        const updatedPrescriptions = prescriptions.filter((prescription) => prescription.key !== key);
        setPrescriptions(updatedPrescriptions);
        localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
      };

      const handleDeleteAll = () => {
        setPrescriptions([]);
        localStorage.removeItem('prescriptions');
      };

      const handlePostcodeChange = (e) => {
        setPostcode(e.target.value);
      };

      const handleUpdatePostcode = () => {
        const updatedUser = { ...user, postcode: postcode };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUpdateMessage('Postcode updated successfully!');
        setTimeout(() => setUpdateMessage(''), 3000);
      };

      const handleAddressChange = (e) => {
        setAddress(e.target.value);
      };

      const handleUpdateAddress = () => {
        const updatedUser = { ...user, address: address };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditingAddress(false);
      };

      return (
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Customer Dashboard</h2>
            <button className="btn" onClick={onLogout}>Logout</button>
          </div>
          {user && <p>Welcome, {user.email}</p>}
          <div>
            {isEditingAddress ? (
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={address} onChange={handleAddressChange} />
                <button className="btn" onClick={handleUpdateAddress}>Save Address</button>
              </div>
            ) : (
              <p>Address: {address} <button className="btn" onClick={() => setIsEditingAddress(true)}>Edit Address</button></p>
            )}
            <div className="form-group">
              <label>Postcode</label>
              <input type="text" value={postcode} onChange={handlePostcodeChange} />
            </div>
            <button className="btn" onClick={handleUpdatePostcode}>Update Postcode</button>
            {updateMessage && <p style={{ color: 'green', marginTop: '5px' }}>{updateMessage}</p>}
          </div>
          <div>
            <h3>Upload Prescription</h3>
            <div className="form-group">
              <label>Select Distance</label>
              <select value={selectedDistance} onChange={handleDistanceChange}>
                <option value="1">1 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="50">50 km</option>
              </select>
            </div>
            <div className="form-group">
              <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
            </div>
            <button className="btn" onClick={handleUpload}>Upload</button>
            {error && <div className="error">{error}</div>}
            {showNotification && <p style={{ color: 'green', marginTop: '5px' }}>Prescription submitted successfully!</p>}
          </div>
          <div>
            <h3>Your Prescriptions</h3>
            {prescriptions.length > 0 ? (
              <ul>
                {prescriptions.map((prescription) => (
                  <li key={prescription.key}>
                    <a href={prescription.url} target="_blank" rel="noopener noreferrer">{prescription.name}</a>
                    <button className="btn" style={{ marginLeft: '10px' }} onClick={() => handleDelete(prescription.key)}>Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No prescriptions uploaded yet.</p>
            )}
            {prescriptions.length > 0 && (
              <button className="btn" onClick={handleDeleteAll}>Delete All</button>
            )}
          </div>
          <div>
            <h3>Your Quotes</h3>
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    {notification.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No quotes yet.</p>
            )}
          </div>
        </div>
      );
    }

    export default CustomerDashboard;
