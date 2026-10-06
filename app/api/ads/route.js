import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper function to ensure table and column types are up-to-date
async function ensureTable(sql) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        size VARCHAR(50) NOT NULL,
        price_crore VARCHAR(100) NOT NULL,
        plot_no VARCHAR(100) NOT NULL,
        phase VARCHAR(50) DEFAULT 'Phase 8',
        corner BOOLEAN DEFAULT FALSE,
        main_boulevard BOOLEAN DEFAULT FALSE,
        west_open BOOLEAN DEFAULT FALSE,
        park_facing BOOLEAN DEFAULT FALSE,
        description TEXT,
        image TEXT,
        youtube_url TEXT,
        date_posted DATE DEFAULT CURRENT_DATE,
        views INT DEFAULT 0
      )
    `;

    // Migrations: Ensure VARCHAR price and youtube_url exist without crash
    await sql`ALTER TABLE ads ALTER COLUMN price_crore TYPE VARCHAR(100) USING price_crore::text`;
    await sql`ALTER TABLE ads ADD COLUMN IF NOT EXISTS youtube_url TEXT`;
  } catch (err) {
    console.warn('Table auto-setup/migration notice:', err.message);
  }
}

// GET: Fetch all ads from Neon DB
export async function GET() {
  try {
    const sql = getDb();
    await ensureTable(sql);

    const rows = await sql`SELECT * FROM ads ORDER BY id DESC`;

    const ads = (rows || []).map(ad => ({
      id: ad.id,
      title: ad.title || '',
      type: ad.type || 'Commercial',
      category: ad.category || '',
      size: ad.size || '',
      priceCrore: ad.price_crore || '0',
      plotNo: ad.plot_no || '',
      phase: ad.phase || 'Phase 8',
      corner: Boolean(ad.corner),
      mainBoulevard: Boolean(ad.main_boulevard),
      westOpen: Boolean(ad.west_open),
      parkFacing: Boolean(ad.park_facing),
      description: ad.description || '',
      image: ad.image || '',
      youtubeUrl: ad.youtube_url || '',
      datePosted: ad.date_posted || '',
      views: ad.views || 0
    }));

    return NextResponse.json({ success: true, ads });
  } catch (error) {
    console.error('Database Fetch Error:', error);
    return NextResponse.json({ 
      success: false, 
      ads: [], 
      error: error.message || 'Database connection error' 
    }, { status: 200 });
  }
}

// POST: Insert a new plot ad into Neon DB
export async function POST(req) {
  try {
    const sql = getDb();
    await ensureTable(sql);

    const body = await req.json();
    const {
      title,
      type,
      category,
      size,
      priceCrore,
      plotNo,
      phase,
      corner,
      mainBoulevard,
      westOpen,
      parkFacing,
      description,
      image,
      youtubeUrl
    } = body;

    // Stringify price to guarantee safe storage without Postgres numeric overflow
    const safePrice = String(priceCrore || '0').trim();

    const insertedRows = await sql`
      INSERT INTO ads (
        title, type, category, size, price_crore, plot_no, phase, 
        corner, main_boulevard, west_open, park_facing, description, image, youtube_url
      ) VALUES (
        ${title}, ${type}, ${category}, ${size}, ${safePrice}, ${plotNo}, ${phase || 'Phase 8'}, 
        ${corner || false}, ${mainBoulevard || false}, ${westOpen || false}, ${parkFacing || false}, 
        ${description || ''}, ${image || ''}, ${youtubeUrl || ''}
      )
      RETURNING *
    `;

    const newAd = insertedRows[0];
    return NextResponse.json({
      success: true,
      ad: {
        id: newAd.id,
        title: newAd.title,
        type: newAd.type,
        category: newAd.category,
        size: newAd.size,
        priceCrore: newAd.price_crore,
        plotNo: newAd.plot_no,
        phase: newAd.phase,
        corner: newAd.corner,
        mainBoulevard: newAd.main_boulevard,
        westOpen: newAd.west_open,
        parkFacing: newAd.park_facing,
        description: newAd.description,
        image: newAd.image,
        youtubeUrl: newAd.youtube_url,
        datePosted: newAd.date_posted,
        views: newAd.views
      }
    });
  } catch (error) {
    console.error('Database Insert Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database insert failed' }, { status: 200 });
  }
}

// DELETE: Delete an ad from Neon DB by ID
export async function DELETE(req) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing Ad ID' }, { status: 400 });
    }

    await sql`DELETE FROM ads WHERE id = ${id}`;
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Database Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database delete failed' }, { status: 200 });
  }
}