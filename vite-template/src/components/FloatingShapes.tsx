/**
 * Page-level decorative floating shapes — brand colours, crisp edges, fixed to viewport.
 * Used on About, Works, and Project detail pages.
 * z-index 1 so content (z-10 and above) always renders on top.
 */
export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Large lavender circle — top-left */}
      <div
        className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full opacity-[0.13] animate-float-slow"
        style={{ backgroundColor: '#d9d1fa' }}
      />
      {/* Orange diamond — top-right */}
      <div
        className="absolute top-16 -right-8 w-[120px] h-[120px] rotate-45 opacity-[0.12] animate-float-medium [animation-delay:2000ms]"
        style={{ backgroundColor: '#f75124' }}
      />
      {/* Mint ring — upper-mid-left */}
      <div
        className="absolute top-1/4 -left-10 w-[200px] h-[200px] rounded-full opacity-[0.18] animate-float-fast [animation-delay:1000ms]"
        style={{ border: '2px solid #baebcd', backgroundColor: 'transparent' }}
      />
      {/* Peach circle — mid-right */}
      <div
        className="absolute top-1/2 -right-16 w-[180px] h-[180px] rounded-full opacity-[0.15] animate-float-slow [animation-delay:3000ms]"
        style={{ backgroundColor: '#faedce' }}
      />
      {/* Small orange circle — lower-mid-left */}
      <div
        className="absolute top-2/3 left-6 w-[80px] h-[80px] rounded-full opacity-[0.13] animate-float-medium [animation-delay:500ms]"
        style={{ backgroundColor: '#f75124' }}
      />
      {/* Lavender diamond — bottom-right */}
      <div
        className="absolute -bottom-10 right-24 w-[110px] h-[110px] rotate-45 opacity-[0.12] animate-float-slow [animation-delay:4000ms]"
        style={{ backgroundColor: '#d9d1fa' }}
      />
      {/* Mint circle — bottom-left */}
      <div
        className="absolute -bottom-8 -left-8 w-[160px] h-[160px] rounded-full opacity-[0.15] animate-float-medium [animation-delay:1500ms]"
        style={{ backgroundColor: '#baebcd' }}
      />
      {/* Orange ring — mid-centre-right */}
      <div
        className="absolute top-1/3 right-1/4 w-[90px] h-[90px] rounded-full opacity-[0.1] animate-float-fast [animation-delay:2500ms]"
        style={{ border: '2px solid #f75124', backgroundColor: 'transparent' }}
      />
    </div>
  );
}
