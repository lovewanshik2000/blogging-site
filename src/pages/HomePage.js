import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Pagination, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import { getPosts, getCategories } from '../services/api';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const normalized = Array.isArray(data) ? data : (data?.results || []);
        setCategories(normalized);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Load posts on page/category change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPosts({ page, category: selectedCategory || undefined });
        // data is paginated: {count, next, previous, results}
        if (Array.isArray(data)) {
          // Backward compatibility if pagination not active
          setPosts(data);
          setCount(data.length);
        } else {
          setPosts(data.results || []);
          setCount(data.count || 0);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, selectedCategory]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setPage(1); // reset to first page on category change
  };

  const pageSize = 9; // keep in sync with backend
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

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

  return (
    <Container className="my-5">
      <motion.h1 
        className="text-center mb-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to Our Blog
      </motion.h1>

      <Row className="mb-4 align-items-end">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Label>Filter by Category</Form.Label>
          <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {(categories || []).map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} className="text-md-end">
          <Badge bg="secondary">{count} posts</Badge>
        </Col>
      </Row>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map((post, index) => (
          <Col key={post.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard post={post} />
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default HomePage;
