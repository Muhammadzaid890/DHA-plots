import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM ads ORDER BY id DESC`;

    const ads = rows.map(ad => ({
      id: ad.id,
      title: ad.title,
      type: ad.type,
      category: ad.category,
      size: ad.size,
      priceCrore: ad.price_crore,
      plotNo: ad.plot_no,
      phase: ad.phase,
      corner: ad.corner,
      mainBoulevard: ad.main_boulevard,
      westOpen: ad.west_open,
      parkFacing: ad.park_facing,
      description: ad.description,
      image: ad.image,
      datePosted: ad.date_posted,
      views: ad.views
    }));

    return NextResponse.json({ success: true, ads });
  } catch (error) {
    console.error('Database Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title, type, category, size, priceCrore, plotNo, phase,
      corner, mainBoulevard, westOpen, parkFacing, description, image
    } = body;

    const insertedRows = await sql`
      INSERT INTO ads (
        title, type, category, size, price_crore, plot_no, phase, 
        corner, main_boulevard, west_open, park_facing, description, image
      ) VALUES (
        ${title}, ${type}, ${category}, ${size}, ${priceCrore}, ${plotNo}, ${phase || 'Phase 8'}, 
        ${corner || false}, ${mainBoulevard || false}, ${westOpen || false}, ${parkFacing || false}, 
        ${description || ''}, ${image || ''}
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
        datePosted: newAd.date_posted,
        views: newAd.views
      }
    });
  } catch (error) {
    console.error('Database Insert Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing Ad ID' }, { status: 400 });
    }

    await sql`DELETE FROM ads WHERE id = ${id}`;
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Database Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
