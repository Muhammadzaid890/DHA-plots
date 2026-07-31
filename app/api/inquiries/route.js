import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, message } = body;

    await sql`
      INSERT INTO inquiries (name, phone, message)
      VALUES (${name}, ${phone}, ${message})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inquiry Save Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to save inquiry' }, { status: 500 });
  }
}