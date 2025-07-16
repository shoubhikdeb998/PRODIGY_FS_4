import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PostCard from '../components/PostCard';

function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const userId = JSON.parse(atob(token.split('.')[1])).id;

    const fetchProfile = async () => {
      try {
        const [postsRes, userRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUserPosts(postsRes.data);
        setUserInfo(userRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.profileBox} data-aos="fade-down">
        <h2 style={styles.username}>👤 {userInfo.username}</h2>
        <p style={styles.email}>📧 {userInfo.email}</p>
        <p style={styles.joined}>
          🕓 Joined: {new Date(userInfo.createdAt).toLocaleDateString()}
        </p>
      </div>

      <h3 style={styles.sectionTitle} data-aos="fade-up">📝 Your Posts</h3>

      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      ) : (
        <p style={{ textAlign: 'center', marginTop: 20 }} data-aos="zoom-in">
          No posts yet.
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: 800,
    margin: '0 auto',
  },
  profileBox: {
    background: '#ffffff',
    padding: 25,
    borderRadius: 16,
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    marginBottom: 40,
  },
  username: {
    color: '#007bff',
    fontSize: 24,
    marginBottom: 5,
  },
  email: {
    color: '#444',
    marginBottom: 4,
  },
  joined: {
    fontSize: 13,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#007bff',
    marginBottom: 20,
  },
};

export default Profile;
