import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const BrokerRegistrationPage = () => {
  const [formData, setFormData] = useState({ name: '', area: '', phone: '' });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [brokerMsg, setBrokerMsg] = useState('');
  const [otpMsg, setOtpMsg] = useState('');

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePropertyTypesChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setPropertyTypes(options);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      setBrokerMsg("Enter valid 10-digit mobile number");
      return;
    }
    setShowOtpModal(true);
    setOtpMsg('Sending OTP...');
    // In a real app, send form data and phone to backend to request OTP
    console.log('Requesting OTP for:', { ...formData, propertyTypes });
    // const res = await fetch('/api/brokers/send-otp', { ... });
    // const result = await res.json();
    // setOtpMsg(result.message);
    setTimeout(() => setOtpMsg('OTP Sent!'), 1000); // Mock response
  };

  const handleVerifyOtp = async () => {
    setOtpMsg('Verifying...');
    // In a real app, send phone and OTP to backend for verification
    console.log('Verifying OTP:', { phone: formData.phone, otp });
    // const res = await fetch('/api/brokers/verify-otp', { ... });
    // const result = await res.json();
    // setOtpMsg(result.message);
    // if (result.success) { ... }
    setTimeout(() => { // Mock success
      setOtpMsg('Verification successful!');
      setShowOtpModal(false);
      setBrokerMsg('Broker registered successfully!');
      // Reset form if needed
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Broker Registration - NewPropertyHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="header">
        <h1>NewPropertyHub</h1>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/property">Properties</Link>
          <Link href="/investor">Investor</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main>
        <section className="broker-profile">
          <h2>Broker Registration</h2>
          <form id="brokerForm" onSubmit={handleFormSubmit}>
            <input type="text" id="name" placeholder="Broker Name" value={formData.name} onChange={handleFormChange} required />
            <input type="text" id="area" placeholder="Area of Operation" value={formData.area} onChange={handleFormChange} required />
            <label htmlFor="propertyTypes">Property Types you handle:</label>
            <select id="propertyTypes" multiple onChange={handlePropertyTypesChange}>
              <option value="Plot">Plot</option>
              <option value="Flat">Flat</option>
              <option value="Commercial">Commercial</option>
              <option value="Office">Office</option>
              <option value="Industrial">Industrial</option>
              <option value="Bungalow">Bungalow</option>
            </select>
            <input type="tel" id="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleFormChange} required />
            <button type="submit">Submit & Verify OTP</button>
          </form>
          {brokerMsg && <p id="brokerMsg">{brokerMsg}</p>}
        </section>

        {showOtpModal && (
          <div id="otpModal">
            <h3>Enter OTP</h3>
            <input type="text" id="otpInput" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button id="verifyOtpBtn" onClick={handleVerifyOtp}>Verify</button>
            {otpMsg && <p id="otpMsg">{otpMsg}</p>}
          </div>
        )}
      </main>

      <footer><p>&copy; 2025 NewPropertyHub</p></footer>
    </>
  );
};

export default BrokerRegistrationPage;