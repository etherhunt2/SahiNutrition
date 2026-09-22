import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?limit=50');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Failed to fetch blogs');
    }
  };

  const handleEdit = (blog: any) => {
    setIsEditing(true);
    setEditingId(blog.id);
    setTitle(blog.title);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setFeaturedImage(blog.featuredImage);
    setStatusMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Saving...');

    const payload = { title, category, excerpt, content, featuredImage };

    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/blogs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setStatusMsg(isEditing ? 'Blog updated successfully!' : 'Blog created successfully!');
        resetForm();
        fetchBlogs();
      } else {
        setStatusMsg('Failed to save blog.');
      }
    } catch (err) {
      setStatusMsg('An error occurred while saving.');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setCategory('');
    setExcerpt('');
    setContent('');
    setFeaturedImage('');
  };

  return (
    <div className="blog-manager">
      <div className="editor-section">
        <h2>{isEditing ? 'Edit Blog' : 'Create New Blog'}</h2>
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Featured Image/Video URL</label>
            <input type="url" value={featuredImage} onChange={e => setFeaturedImage(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Excerpt (Short Description)</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} required />
          </div>
          <div className="form-group" style={{ minHeight: '350px', marginBottom: '50px' }}>
            <label>Content</label>
            <RichTextEditor 
              value={content} 
              onChange={setContent} 
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">{isEditing ? 'Update Blog' : 'Publish Blog'}</button>
            {isEditing && <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>}
          </div>
          {statusMsg && <p className="status-msg">{statusMsg}</p>}
        </form>
      </div>

      <div className="list-section">
        <h2>Manage Blogs</h2>
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
                  <button onClick={() => handleEdit(blog)} className="action-btn edit-btn">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="action-btn del-btn">Delete</button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && <tr><td colSpan={4}>No blogs found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
