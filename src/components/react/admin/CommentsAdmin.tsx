import React, { useState, useEffect } from 'react';

export default function CommentsAdmin() {
  const [comments, setComments] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Failed to fetch comments');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('Comment deleted successfully!');
        fetchComments();
      } else {
        setStatusMsg('Failed to delete comment.');
      }
    } catch (err) {
      setStatusMsg('Error deleting comment.');
    }
  };

  return (
    <div className="list-section">
      {statusMsg && <p className="status-msg">{statusMsg}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Comment</th>
            <th>Location</th>
            <th>Device</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment.id}>
              <td>{comment.name}</td>
              <td>{comment.email}</td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {comment.content}
              </td>
              <td>
                {comment.location?.lat ? `${comment.location.lat.toFixed(2)}, ${comment.location.lng.toFixed(2)}` : 'N/A'}
              </td>
              <td>
                <div style={{ fontSize: '0.85em' }}>
                  IP: {comment.ipAddress}<br/>
                  OS: {comment.os}<br/>
                  Screen: {comment.screenSize}
                </div>
              </td>
              <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(comment.id)} className="action-btn del-btn">Delete</button>
              </td>
            </tr>
          ))}
          {comments.length === 0 && <tr><td colSpan={7}>No comments found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
