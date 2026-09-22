import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../../lib/mongodb';
import { Blog } from '../../../models/Blog';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '5');
  const category = url.searchParams.get('category');
  
  try {
    await connectToDatabase();
    
    const query = category && category !== 'All' ? { category } : {};
    
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Blog.countDocuments(query);
    const hasMore = skip + blogs.length < total;

    // Convert _id to id for frontend compatibility
    const formattedBlogs = blogs.map(blog => {
      const { _id, ...rest } = blog;
      return { id: _id.toString(), ...rest };
    });

    return new Response(JSON.stringify({ blogs: formattedBlogs, hasMore, total }), { status: 200 });
  } catch (error) {
    console.error('Fetch blogs error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check auth
  if (!cookies.has('admin_session')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await connectToDatabase();
    const data = await request.json();
    
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug exists
    const existing = await Blog.findOne({ slug });
    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const newBlog = new Blog({
      title: data.title,
      slug: finalSlug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      category: data.category || 'Uncategorized',
    });

    await newBlog.save();
    
    const { _id, ...rest } = newBlog.toObject();

    return new Response(JSON.stringify({ success: true, blog: { id: _id.toString(), ...rest } }), { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create blog' }), { status: 500 });
  }
};
