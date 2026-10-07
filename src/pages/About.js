import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>About Us</h1>
        <p className="lead mt-3">
          This is a modern, responsive blogging platform built with a Django REST
          Framework backend and a React.js frontend.
        </p>
        <p>
          It demonstrates clean component structure, RESTful APIs, pagination,
          category filtering, and smooth animations with Framer Motion. The UI
          uses Bootstrap 5 for responsive design.
        </p>
        <p>
          Use the navigation above to browse posts, learn more about us, or get
          in touch via the contact form.
        </p>
      </motion.div>
    </Container>
  );
};

export default About;
