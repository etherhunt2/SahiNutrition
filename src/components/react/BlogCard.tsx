import React from 'react';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    featuredImage: string;
    createdAt: string;
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  const isVideo = Boolean(blog.featuredImage && (blog.featuredImage.match(/\.(mp4|webm|ogg)$/i) || blog.featuredImage.includes('youtube.com') || blog.featuredImage.includes('vimeo.com')));

  return (
    <a href={`/blog/${blog.slug}`} className="blog-card">
      <div className="blog-card__media">
        {isVideo ? (
          <div className="blog-card__video-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        ) : null}
        <img src={blog.featuredImage || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80'} alt={blog.title} loading="lazy" />
        <div className="blog-card__category">{blog.category}</div>
      </div>
      
      <div className="blog-card__content">
        <div className="blog-card__date">{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <h3 className="blog-card__title">{blog.title}</h3>
        <p className="blog-card__excerpt">{blog.excerpt}</p>
        <span className="blog-card__read-more">Read Full Story &rarr;</span>
      </div>
    </a>
  );
}
