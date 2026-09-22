import React, { useState, useEffect } from 'react';

export default function BlogListAdmin() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?limit=100');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Failed to fetch blogs');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('Blog deleted successfully!');
        fetchBlogs();
      } else {
        setStatusMsg('Failed to delete blog.');
      }
    } catch (err) {
      setStatusMsg('Error deleting blog.');
    }
  };

  return (
    <div className="list-section">
      {statusMsg && <p className="status-msg">{statusMsg}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.category}</td>
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td>
                <a href={`/admin/edit-blog/${blog.id}`} className="action-btn edit-btn" style={{ textDecoration: 'none' }}>Edit</a>
                <button onClick={() => handleDelete(blog.id)} className="action-btn del-btn">Delete</button>
              </td>
            </tr>
          ))}
          {blogs.length === 0 && <tr><td colSpan={4}>No blogs found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
