import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../../lib/mongodb';
import { Blog } from '../../../models/Blog';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (!cookies.has('admin_session')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await connectToDatabase();
    const id = params.id;
    const data = await request.json();
    
    let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug exists for OTHER blogs
    const existing = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        category: data.category || 'Uncategorized',
      },
      { new: true }
    ).lean();

    if (!updatedBlog) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), { status: 404 });
    }

    const { _id, ...rest } = updatedBlog;

    return new Response(JSON.stringify({ success: true, blog: { id: _id.toString(), ...rest } }), { status: 200 });
  } catch (error) {
    console.error('Update blog error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update blog' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!cookies.has('admin_session')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await connectToDatabase();
    const id = params.id;
    
    const deleted = await Blog.findByIdAndDelete(id);
    
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Delete blog error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete blog' }), { status: 500 });
  }
};

export const GET: APIRoute = async ({ params }) => {
  try {
    await connectToDatabase();
    const id = params.id;
    
    const blog = await Blog.findById(id).lean();
    
    if (!blog) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), { status: 404 });
    }

    const { _id, ...rest } = blog;
    
    return new Response(JSON.stringify({ id: _id.toString(), ...rest }), { status: 200 });
  } catch (error) {
    console.error('Get blog error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get blog' }), { status: 500 });
  }
}
