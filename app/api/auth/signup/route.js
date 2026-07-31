import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'All required fields must be filled' }, { status: 400 });
    }

    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
    if (existingUsers.length > 0) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 400 });
    }

    const insertedUsers = await sql`
      INSERT INTO users (name, email, phone, password, role)
      VALUES (${name}, ${email.toLowerCase()}, ${phone || ''}, ${password}, 'user')
      RETURNING id, name, email, phone, role
    `;

    const user = insertedUsers[0];
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
