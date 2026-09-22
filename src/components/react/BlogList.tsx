import React, { useState, useEffect, useRef, useCallback } from 'react';
import BlogCard from './BlogCard';

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchBlogs = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?page=${pageNumber}&limit=6`);
      const data = await res.json();
      
      setBlogs(prev => [...prev, ...(data.blogs || [])]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
          const next = prev + 1;
          fetchBlogs(next);
          return next;
        });
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="blog-list-container">
      {blogs.length === 0 && !loading && (
        <div style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem 0' }}>
          No blogs published yet.
        </div>
      )}
      
      <div className="blog-grid">
        {blogs.map((blog, index) => {
          if (blogs.length === index + 1) {
            return (
              <div ref={lastElementRef} key={blog.id}>
                <BlogCard blog={blog} />
              </div>
            );
          } else {
            return <BlogCard key={blog.id} blog={blog} />;
          }
        })}
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
