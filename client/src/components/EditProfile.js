import { useState } from "react";
import React from "react";
import axios from "axios";

const EditProfile = () => {
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData({
          ...passwordFormData,
          [name]: value,
        });
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            alert('Passwords do not match');
            return
        }
        try {
            axios.post('/api/update-password', {
                oldPassword: passwordFormData.currentPassword,
                newPassword: passwordFormData.newPassword,
                confirmPassword: passwordFormData.confirmPassword
            },
            {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Current password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordFormData.currentPassword}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div>
                        <label>New password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordFormData.newPassword}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div>
                        <label>Confirm new password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordFormData.confirmPassword}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;