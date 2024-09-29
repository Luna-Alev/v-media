import React, { useState } from 'react';
import axios from 'axios';
import './PostForm.css';

const PostForm = () => {
  const themes = ['Technology', 'Health', 'Education', 'Finance', 'Lifestyle', 'Gaming'];

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    theme: themes[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      axios.post('http://localhost:3001/new_post', {
        title: formData.title,
        body: formData.body,
        theme: formData.theme,
      },
      {
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Reset the form data
      setFormData({
        title: '',
        body: '',
        theme: themes[0]
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="post-form">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter the post title"
          />
        </div>

        {/* Body/Content Input */}
        <div>
          <label htmlFor="body">Content:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            required
            placeholder="Enter the post content"
            rows="5"
          />
        </div>

        {/* Theme Dropdown */}
        <div>
          <label htmlFor="theme">Theme:</label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleInputChange}
          >
            {themes.map((theme, index) => (
              <option key={index} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default PostForm;