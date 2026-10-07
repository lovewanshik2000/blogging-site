import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getPreviewBlogs, approveBlog } from '../services/api';

const PreviewList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPreviewBlogs();
      setItems(Array.isArray(data) ? data : (data?.results || []));
      setError(null);
    } catch (err) {
      setError('Failed to load preview blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onApprove = async (id) => {
    setApproving((s) => ({ ...s, [id]: true }));
    try {
      await approveBlog(id);
      setItems((list) => list.filter((x) => x.id !== id));
    } catch (err) {
      alert('Approval failed');
    } finally {
      setApproving((s) => ({ ...s, [id]: false }));
    }
  };

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
        <h1 className="mb-0">Preview Blogs</h1>
        <Badge bg="secondary">{items.length} pending</Badge>
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
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <Badge bg="info">{post?.category_detail?.name || 'Uncategorized'}</Badge>
                    <Button variant="success" size="sm" disabled={!!approving[post.id]} onClick={() => onApprove(post.id)}>
                      {approving[post.id] ? 'Approving…' : 'Approve'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
      {items.length === 0 && (
        <Alert className="mt-4" variant="secondary">No previews pending.</Alert>
      )}
    </Container>
  );
};

export default PreviewList;
