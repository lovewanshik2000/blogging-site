import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center py-3 mt-auto border-top">
      <div className="container">
        <small>&copy; {new Date().getFullYear()} Django + React Blog</small>
      </div>
    </footer>
  );
};

export default Footer;
