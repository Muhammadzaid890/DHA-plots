import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const sql = getDb();
    const body = await req.json();
    const { action, email, password, name, phone, role } = body;

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (tableErr) {
      console.warn('Users table verification notice:', tableErr.message);
    }

    const normalizedEmail = (email || '').toLowerCase().trim();

    if (action === 'signup') {
      // Automatically assign admin role if email contains 'admin' or 'zeshan'
      const assignedRole = role || (normalizedEmail.includes('admin') || normalizedEmail.includes('zeshan') ? 'admin' : 'user');
      const userName = name || (assignedRole === 'admin' ? 'Zeshan Khurshid (Admin)' : normalizedEmail.split('@')[0]);

      // Check if user already exists
      const existing = await sql`SELECT * FROM users WHERE LOWER(email) = ${normalizedEmail}`;
      if (existing && existing.length > 0) {
        return NextResponse.json({ success: false, error: 'User with this email already exists in Database!' }, { status: 200 });
      }

      const inserted = await sql`
        INSERT INTO users (name, email, phone, password, role)
        VALUES (${userName}, ${normalizedEmail}, ${phone || ''}, ${password}, ${assignedRole})
        RETURNING id, name, email, phone, role
      `;

      return NextResponse.json({ success: true, user: inserted[0] });
    }

    if (action === 'login') {
      const rows = await sql`SELECT id, name, email, phone, role, password FROM users WHERE LOWER(email) = ${normalizedEmail}`;

      if (rows && rows.length > 0) {
        const user = rows[0];
        if (user.password !== password) {
          return NextResponse.json({ success: false, error: 'Incorrect password!' }, { status: 200 });
        }
        return NextResponse.json({
          success: true,
          user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
      }

      // If logging in with admin credentials for the first time, auto-seed into Neon DB
      if (normalizedEmail.includes('admin') || normalizedEmail.includes('zeshan')) {
        const adminName = name || 'Zeshan Khurshid (Admin)';
        const seeded = await sql`
          INSERT INTO users (name, email, phone, password, role)
          VALUES (${adminName}, ${normalizedEmail}, ${phone || '03331234201'}, ${password}, 'admin')
          RETURNING id, name, email, phone, role
        `;
        return NextResponse.json({ success: true, user: seeded[0] });
      }

      return NextResponse.json({ success: false, error: 'Account not found in DB. Please Sign Up first!' }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Database Auth Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Authentication failed' }, { status: 200 });
  }
}