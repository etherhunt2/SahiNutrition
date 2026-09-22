import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

export default function BlogForm({ blogId }: { blogId?: string }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${blogId}`);
      if (res.ok) {
        const blog = await res.json();
        setTitle(blog.title);
        setCategory(blog.category);
        setExcerpt(blog.excerpt);
        setContent(blog.content);
        setFeaturedImage(blog.featuredImage);
      }
    } catch (err) {
      console.error('Failed to fetch blog');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Saving...');

    const payload = { title, category, excerpt, content, featuredImage };

    try {
      let res;
      if (blogId) {
        res = await fetch(`/api/blogs/${blogId}`, {
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
        setStatusMsg(blogId ? 'Blog updated successfully!' : 'Blog created successfully!');
        if (!blogId) {
          setTitle('');
          setCategory('');
          setExcerpt('');
          setContent('');
          setFeaturedImage('');
        }
      } else {
        setStatusMsg('Failed to save blog.');
      }
    } catch (err) {
      setStatusMsg('An error occurred while saving.');
    }
  };

  return (
    <div className="editor-section">
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
          <button type="submit" className="btn-primary">{blogId ? 'Update Blog' : 'Publish Blog'}</button>
          <a href="/admin/manage-blogs" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Cancel</a>
        </div>
        {statusMsg && <p className="status-msg">{statusMsg}</p>}
      </form>
    </div>
  );
}
