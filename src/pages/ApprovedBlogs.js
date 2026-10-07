import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Pagination, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getApprovedBlogs } from '../services/api';

const ApprovedBlogs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 9;

  const load = async () => {
    setLoading(true);
    try {
      const data = await getApprovedBlogs({ page });
      if (Array.isArray(data)) {
        setItems(data);
        setCount(data.length);
      } else {
        setItems(data.results || []);
        setCount(data.count || 0);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load approved blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
    </div>
  );

  if (error) return (
    <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>
  );

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Live Blogs</h1>
        <Badge bg="secondary">{count} posts</Badge>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4">
        {items.map((post, idx) => (
          <Col key={post.id}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
              <Card className="h-100 shadow-sm">
                {post.image && (
                  <Card.Img variant="top" src={post.image} alt={post.title} style={{ height: 200, objectFit: 'cover' }} />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{post.title}</Card.Title>
                  <Card.Text className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {(post.body || '').slice(0, 200)}{(post.body || '').length > 200 ? '…' : ''}
                  </Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
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

export default ApprovedBlogs;
