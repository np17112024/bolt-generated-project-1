
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { v4 as uuidv4 } from 'uuid';

    function PharmacyDashboard({ onLogout }) {
      const [user, setUser] = useState(null);
      const [documents, setDocuments] = useState([]);
      const [phoneNumber, setPhoneNumber] = useState('');
      const [postcode, setPostcode] = useState('');
      const [address, setAddress] = useState('');
      const [file, setFile] = useState(null);
      const [updateMessage, setUpdateMessage] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();
      const [isEditingAddress, setIsEditingAddress] = useState(false);
      const [notifications, setNotifications] = useState([]);
      const [viewingPrescription, setViewingPrescription] = useState(null);
      const [quote, setQuote] = useState('');
      const [prescriptions, setPrescriptions] = useState([]);

      useEffect(() => {
        const storedPharmacy = localStorage.getItem('pharmacy');
        if (storedPharmacy) {
          const pharmacy = JSON.parse(storedPharmacy);
          setUser(pharmacy);
          setPhoneNumber(pharmacy.phoneNumber);
          setPostcode(pharmacy.postcode);
          setAddress(pharmacy.address);
          fetchDocuments(pharmacy);
          fetchNotifications(pharmacy);
        }
        fetchPrescriptions();
      }, []);

      const fetchDocuments = (pharmacy) => {
          const initialDocuments = [];
          if (pharmacy.pharmacyCertificate) {
            initialDocuments.push({ key: `reg-doc-${uuidv4()}`, name: pharmacy.pharmacyCertificate, url: '#' });
          }
          if (pharmacy.addressProof) {
            initialDocuments.push({ key: `reg-doc-${uuidv4()}`, name: pharmacy.addressProof, url: '#' });
          }
          if (pharmacy.pharmacistId) {
            initialDocuments.push({ key: `reg-doc-${uuidv4()}`, name: pharmacy.pharmacistId, url: '#' });
          }
        const storedDocuments = localStorage.getItem(`pharmacyDocuments-${pharmacy.email}`);
        if (storedDocuments) {
          setDocuments([...initialDocuments, ...JSON.parse(storedDocuments)]);
        } else {
            setDocuments(initialDocuments);
        }
      };

      const fetchNotifications = (pharmacy) => {
        const storedNotifications = localStorage.getItem(`pharmacyNotifications-${pharmacy.email}`);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      };

      const fetchPrescriptions = () => {
        const storedPrescriptions = localStorage.getItem('prescriptions');
        if (storedPrescriptions) {
          setPrescriptions(JSON.parse(storedPrescriptions));
        }
      };

      const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };

      const handleUpload = () => {
        if (!file) {
          setError("Please select a file to upload.");
          return;
        }
        const newDocument = {
          key: `documents/${uuidv4()}-${file.name}`,
          name: file.name,
          url: URL.createObjectURL(file),
        };
        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);
        localStorage.setItem(`pharmacyDocuments-${user.email}`, JSON.stringify(updatedDocuments));
        setFile(null);
      };

      const handleDelete = (key) => {
        const updatedDocuments = documents.filter((document) => document.key !== key);
        setDocuments(updatedDocuments);
        localStorage.setItem(`pharmacyDocuments-${user.email}`, JSON.stringify(updatedDocuments));
      };

      const handleDeleteAll = () => {
        setDocuments([]);
        localStorage.removeItem(`pharmacyDocuments-${user.email}`);
      };

      const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
      };

      const handlePostcodeChange = (e) => {
        setPostcode(e.target.value);
      };

      const handleUpdatePhoneNumber = () => {
        const updatedPharmacy = { ...user, phoneNumber: phoneNumber };
        setUser(updatedPharmacy);
        localStorage.setItem('pharmacy', JSON.stringify(updatedPharmacy));
      };

      const handleAddressChange = (e) => {
        setAddress(e.target.value);
      };

      const handleUpdateAddress = () => {
        const updatedPharmacy = { ...user, address: address };
        setUser(updatedPharmacy);
        localStorage.setItem('pharmacy', JSON.stringify(updatedPharmacy));
        setIsEditingAddress(false);
      };

      const handleUpdatePostcode = () => {
        const updatedPharmacy = { ...user, postcode: postcode };
        setUser(updatedPharmacy);
        localStorage.setItem('pharmacy', JSON.stringify(updatedPharmacy));
        setUpdateMessage('Postcode updated successfully!');
        setTimeout(() => setUpdateMessage(''), 3000);
      };

      const handleViewPrescription = (notification) => {
        setViewingPrescription(notification.prescriptionKey);
        setTimeout(() => setViewingPrescription(null), 600000);
      };

      const handleQuoteChange = (e) => {
        setQuote(e.target.value);
      };

      const handleSendQuote = (notification) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const newQuote = {
            id: uuidv4(),
            type: 'quote',
            message: `Quote from ${user.email}: ${quote}`,
            prescriptionKey: notification.prescriptionKey,
            timestamp: new Date().toISOString(),
          };
          const storedNotifications = localStorage.getItem(`customerNotifications-${user.email}`);
          const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
          localStorage.setItem(`customerNotifications-${user.email}`, JSON.stringify([...existingNotifications, newQuote]));
          setQuote('');
        }
      };

      return (
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Pharmacy Dashboard</h2>
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
            <h3>Upload Documents</h3>
            <div className="form-group">
              <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
            </div>
            <button className="btn" onClick={handleUpload}>Upload</button>
            {error && <div className="error">{error}</div>}
          </div>
          <div>
            <h3>Your Documents</h3>
            {documents.length > 0 ? (
              <ul>
                {documents.map((document) => (
                  <li key={document.key}>
                    <a href={document.url} target="_blank" rel="noopener noreferrer">{document.name}</a>
                    <button className="btn" style={{ marginLeft: '10px' }} onClick={() => handleDelete(document.key)}>Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents uploaded yet.</p>
            )}
            {documents.length > 0 && (
              <button className="btn" onClick={handleDeleteAll}>Delete All</button>
            )}
          </div>
          <div>
            <h3>New Prescriptions</h3>
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    {notification.message}
                    <button className="btn" style={{ marginLeft: '10px' }} onClick={() => handleViewPrescription(notification)}>View</button>
                    {viewingPrescription === notification.prescriptionKey && (
                      <div>
                        <p>Prescription Document: <a href={prescriptions.find(p => p.key === notification.prescriptionKey)?.url} target="_blank" rel="noopener noreferrer">View</a></p>
                        <div className="form-group">
                          <label>Quote</label>
                          <input type="text" value={quote} onChange={handleQuoteChange} />
                        </div>
                        <button className="btn" onClick={() => handleSendQuote(notification)}>Send Quote</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No new prescriptions.</p>
            )}
          </div>
          <div>
            <h3>Update Phone Number</h3>
            <div className="form-group">
              <label