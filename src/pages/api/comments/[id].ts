import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../../lib/mongodb';
import { Comment } from '../../../models/Comment';

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!cookies.has('admin_session')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await connectToDatabase();
    const id = params.id;
    
    const deleted = await Comment.findByIdAndDelete(id);
    
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Delete comment error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete comment' }), { status: 500 });
  }
};
