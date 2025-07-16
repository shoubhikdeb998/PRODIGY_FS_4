import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function CreatePost() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      alert('Post uploaded successfully!');
      setDescription('');
      setImage(null);
      navigate('/');
    } catch (err) {
      console.error('UPLOAD ERROR:', err.response?.data || err.message);
      alert('Failed to upload post');
    }
  };

  return (
    <div style={styles.container} data-aos="fade-up">
      <h2 style={styles.title}>Create a New Post</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.button}>Post</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '60px auto',
    padding: 20,
    borderRadius: '15px',
    background: '#ffffff',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#007BFF'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  textarea: {
    height: 100,
    padding: 10,
    borderRadius: '10px',
    border: '1px solid #ccc',
    resize: 'none'
  },
  fileInput: {
    padding: 5
  },
  button: {
    background: '#007BFF',
    color: '#fff',
    padding: '10px 0',
    border: 'none',
    borderRadius: '10px',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default CreatePost;
