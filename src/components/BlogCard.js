import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
  
  // Limit the body text to 150 characters
  const previewText = post.body.length > 150 
    ? `${post.body.substring(0, 150)}...` 
    : post.body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card className="h-100 shadow-sm">
        <Card.Img 
          variant="top" 
          src={`https://picsum.photos/seed/${post.id}/600/300`} 
          alt={post.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-truncate">{post.title}</Card.Title>
          <Card.Text className="text-muted">
            {previewText}
          </Card.Text>
          <div className="mt-auto">
            <Button 
              variant="primary" 
              onClick={() => navigate(`/post/${post.id}`)}
            >
              Read More
            </Button>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>Posted by User #{post.user_id}</small>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
