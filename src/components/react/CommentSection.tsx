import React, { useState, useEffect } from 'react';

export default function CommentSection({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?blogId=${blogId}`);
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Submitting comment...');

    // Collect browser/device info
    const os = navigator.userAgent;
    const screenSize = `${window.screen.width}x${window.screen.height}`;
    
    // We will attempt to get location, but proceed if denied/failed
    let location = { lat: 0, lng: 0 };
    
    const tryPost = async () => {
      try {
        const payload = {
          blogId,
          name,
          email,
          content,
          os,
          screenSize,
          location
        };

        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setStatusMsg('Comment posted successfully!');
          setName('');
          setEmail('');
          setContent('');
          fetchComments(); // Refresh list
        } else {
          setStatusMsg('Failed to post comment.');
        }
      } catch (err) {
        setStatusMsg('An error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          tryPost();
        },
        (error) => {
          // Proceed without location
          tryPost();
        }
      );
    } else {
      // Proceed without location
      tryPost();
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <h4>Leave a Reply</h4>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Comment</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} required></textarea>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
        {statusMsg && <p className="status-msg">{statusMsg}</p>}
      </form>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <strong>{comment.name}</strong>
              <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="no-comments">Be the first to comment!</p>}
      </div>
      
      <style>{`
        .comment-section {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .comment-section h3 {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 2rem;
        }
        .comment-form {
          background: rgba(255, 255, 255, 0.03);
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 3rem;
        }
        .comment-form h4 {
          margin-top: 0;
          color: #10b981;
          margin-bottom: 1.5rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          color: #9ca3af;
          font-size: 0.875rem;
        }
        .form-group input, .form-group textarea {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          font-family: inherit;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #10b981;
        }
        .status-msg {
          margin-top: 1rem;
          color: #10b981;
        }
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .comment-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .comment-header strong {
          color: #fff;
        }
        .comment-date {
          color: #9ca3af;
          font-size: 0.875rem;
        }
        .comment-content {
          color: #d1d5db;
          line-height: 1.6;
          margin: 0;
        }
        .no-comments {
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
