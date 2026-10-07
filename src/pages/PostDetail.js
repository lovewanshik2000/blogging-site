import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getPost } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (err) {
        setError('Failed to load the post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={`https://picsum.photos/seed/${post.id}/1200/400`}
          alt={post.title}
          className="img-fluid rounded mb-4"
          style={{ objectFit: 'cover', width: '100%', maxHeight: 400 }}
        />
        <h1 className="mb-3">{post.title}</h1>
        <p className="text-muted">Posted by User #{post.user_id}</p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
        <Button as={Link} to="/" variant="secondary" className="mt-3">
          Back to Home
        </Button>
      </motion.div>
    </Container>
  );
};

export default PostDetail;
