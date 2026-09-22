import type { APIRoute } from 'astro';
import { readJson } from '../../../utils/jsonDb';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const adminData = await readJson<{ username: string; password: string }>('admin.json');

    if (data.username === adminData.username && data.password === adminData.password) {
      cookies.set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        maxAge: 60 * 60 * 24 // 1 day
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
