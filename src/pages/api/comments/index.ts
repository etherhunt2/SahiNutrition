import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../../lib/mongodb';
import { Comment } from '../../../models/Comment';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const blogId = url.searchParams.get('blogId');
  
  try {
    await connectToDatabase();
    
    const query = blogId ? { blogId } : {};
    
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .lean();
      
    // Convert _id to id
    const formattedComments = comments.map(comment => {
      const { _id, blogId, ...rest } = comment;
      return { id: _id.toString(), blogId: blogId.toString(), ...rest };
    });

    return new Response(JSON.stringify({ comments: formattedComments }), { status: 200 });
  } catch (error) {
    console.error('Fetch comments error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Capture IP address if available
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'Unknown';

    const newComment = new Comment({
      blogId: data.blogId,
      name: data.name,
      email: data.email,
      content: data.content,
      ipAddress: ipAddress,
      os: data.os,
      screenSize: data.screenSize,
      location: data.location
    });

    await newComment.save();
    
    const { _id, blogId, ...rest } = newComment.toObject();

    return new Response(JSON.stringify({ success: true, comment: { id: _id.toString(), blogId: blogId.toString(), ...rest } }), { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create comment' }), { status: 500 });
  }
};
