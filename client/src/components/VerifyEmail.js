import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/verify-email?token=${token}&email=${email}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Email verification failed');
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div>
      <h2>{message}</h2>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

export default VerifyEmail;