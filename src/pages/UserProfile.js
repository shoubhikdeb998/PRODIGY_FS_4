import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams(); // user ID from route
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsFollowing(res.data.followers.includes(currentUser.id));
    } catch (err) {
      alert("User not found");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      alert("Failed to load posts");
    }
  };

  const handleFollowToggle = async () => {
    try {
      const url = isFollowing
        ? `http://localhost:5000/api/users/${id}/unfollow`
        : `http://localhost:5000/api/users/${id}/follow`;

      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsFollowing(!isFollowing);
    } catch (err) {
      alert("Action failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>@{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Followers: {user.followers.length} | Following: {user.following.length}</p>

      {user._id !== currentUser.id && (
        <button onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      <h3>{user.username}'s Posts</h3>
      {posts.map(post => (
        <div key={post._id} style={styles.post}>
          <p>{post.description}</p>
          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt="Post"
              style={styles.image}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '40px auto' },
  post: { border: '1px solid #ccc', padding: 10, marginBottom: 10, borderRadius: 6 },
  image: { width: '100%', borderRadius: 8 }
};

export default UserProfile;
