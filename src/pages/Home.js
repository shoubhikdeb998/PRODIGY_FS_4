import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PostCard from '../components/PostCard'; // ✅ import the component
import Navbar from '../components/Navbar';


function Home() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error('FETCH ERROR:', err.response?.data || err.message);
      }
    };

    fetchPosts();
  }, [token]);

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Re-fetch posts to update like count
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('LIKE ERROR:', err.response?.data || err.message);
    }
  };

return (
  <>
    <nav style={styles.nav}>
      <h3>SocialSync</h3>

    </nav>

    <div style={styles.container}>
      <h2 style={styles.heading}>📰 Feed</h2>

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onLike={handleLike} />
      ))}
    </div>
  </>
);

}

const styles = {
  container: {
    maxWidth: 800,
    margin: '40px auto',
    padding: '0 20px',
  },
  heading: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 30,
  },
  nav: {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '12px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
},
};

export default Home;
