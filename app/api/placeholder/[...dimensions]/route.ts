import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string[] } }
) {
  const [width, height] = params.dimensions;
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2E4053;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#34C759;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" opacity="0.1"/>
      <rect width="100%" height="100%" fill="none" stroke="#e5e7eb" stroke-width="2"/>
      <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle" dy=".3em">
        ${width} × ${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}