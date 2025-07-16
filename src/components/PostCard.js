import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function PostCard({ post, onLike }) {
  const handleLike = () => {
    onLike(post._id);
  };

  return (
    <div style={styles.card} data-aos="zoom-in">
      <div style={styles.header}>
        <span style={styles.username}>@{post.userId?.username || "unknown"}</span>
        <span style={styles.time}>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <p style={styles.desc}>{post.description}</p>
      {post.image && (
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          alt="post"
          style={styles.image}
        />
      )}
      <div style={styles.actions}>
        <button onClick={handleLike} style={styles.likeBtn}>
          ❤️ {post.likes?.length || 0}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    padding: 20,
    marginBottom: 25,
    maxWidth: 700,
    marginInline: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  username: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  desc: {
    marginBottom: 12,
    color: '#333',
  },
  image: {
    width: '100%',
    maxHeight: 400,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 10,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  likeBtn: {
    border: 'none',
    background: '#e7f1ff',
    color: '#007bff',
    padding: '6px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default PostCard;
