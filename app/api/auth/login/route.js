import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // Default Admin Login Fallback
    if (email === 'admin@dhaplots.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        user: { id: 0, name: 'Zeeshan Khursheed (Admin)', email: 'admin@dhaplots.com', role: 'admin' }
      });
    }

    const users = await sql`
      SELECT id, name, email, phone, role, password 
      FROM users 
      WHERE LOWER(email) = ${email.toLowerCase()}
    `;

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found. Please sign up first.' }, { status: 404 });
    }

    const user = users[0];
    if (user.password !== password) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    delete user.password;
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
