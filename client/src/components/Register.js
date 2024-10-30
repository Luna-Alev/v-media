import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

const Register = () => {
  const theGenders = ['No', 'Yes', 'Maybe', 'Somedays', 'Never', 'Banana', 'Depressed', 'Cheese', 'Furry', 'Youtuber'];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    birthDate: '',
    gender: theGenders[0]
  });
  const [recaptcha, setRecaptcha] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRecaptcha = (value) => {
    setRecaptcha(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!recaptcha) {
      setError('Please verify you are not a robot');
      return;
    }

    try {
        const response = await axios.post('/api/register', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            password: formData.password,
            email: formData.email,
            birthDate: formData.birthDate,
            recaptchaToken: recaptcha
        });

        setError('');
        navigate('/login');
        alert('Registration successful! Please check your email for verification.');
    } catch (error) {
        if (error.response.data.error) {
            setError(error.response.data.error);
        } else {
            setError('Error registering');
        }
    }
  };

  return (
    <div className="register-container">
    <h2>Register</h2>
    {error && <p className="error-message">{error}</p>}

    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Birth Date</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <ReCAPTCHA
          sitekey='6Lfsx1EqAAAAAM2Vpx-jLf6lti3pvQuKsYKCNlkv'
          onChange={handleRecaptcha}
        />
      </div>

      <button type="submit" className="submit-button">Register</button>
    </form>
  </div>
  );
};

export default Register;