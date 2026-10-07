import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPosts = async ({ page = 1, category } = {}) => {
  try {
    const params = {};
    if (page) params.page = page;
    if (category) params.category = category;
    const response = await api.get('/posts/', { params });
    return response.data; // {count, next, previous, results}
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts/', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/posts/${id}/`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}/`);
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data; // array of categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const submitContact = async (payload) => {
  try {
    const response = await api.post('/contact/', payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Preview workflow services
export const getPreviewBlogs = async () => {
  try {
    const response = await api.get('/preview-blogs/');
    return response.data; // array
  } catch (error) {
    console.error('Error fetching preview blogs:', error);
    throw error;
  }
};

export const createPreviewBlog = async (payload) => {
  try {
    const response = await api.post('/preview-blogs/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating preview blog:', error);
    throw error;
  }
};

export const approveBlog = async (id) => {
  try {
    const response = await api.post(`/approve-blog/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error approving blog:', error);
    throw error;
  }
};

export const getApprovedBlogs = async ({ page = 1 } = {}) => {
  try {
    const response = await api.get('/blogs/', { params: { page } });
    return response.data; // paginated
  } catch (error) {
    console.error('Error fetching approved blogs:', error);
    throw error;
  }
};
