/**
 * An original pixel-art-style scene — park setting, small skyline, a
 * laptop showing code — same general mood as the reliabuilds.com hero
 * visual that inspired it, but its own composition and artwork, not a
 * copy: hand-built from flat SVG shapes, not an image asset (no
 * image-generation tool is available in this environment, and lifting
 * their actual illustration wouldn't be appropriate regardless). The
 * snippet is illustrative of what this codebase actually does (pausing a
 * client's site) kept deliberately short so it stays legible at any size,
 * down to the smallest mobile screens, rather than a verbatim excerpt.
 *
 * Monochrome by construction — only the site's existing void/hairline/
 * graphite/chalk/signal tokens, no new hues, so "black and white" needs
 * no extra treatment.
 *
 * The code overlay is real HTML (not baked into the SVG) positioned by
 * percentage over the SVG's screen rect, so the two stay in sync at any
 * size and the text stays crisp and selectable.
 */
function Keyword({ children }: { children: React.ReactNode }) {
  return <span className="text-chalk">{children}</span>;
}

const VIEW_W = 1200;
const VIEW_H = 360;

// Laptop screen inner area, in viewBox units — the HTML code overlay
// below is positioned from these same numbers so it can't drift out of
// sync with the drawn bezel.
const SCREEN = { x: 640, y: 118, w: 230, h: 140 };

export function HeroScene() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/9] w-full min-w-0 overflow-hidden border border-hairline sm:aspect-[10/3]"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* Clouds */}
        <g fill="var(--color-graphite)" opacity="0.35">
          <ellipse cx="120" cy="55" rx="46" ry="16" />
          <ellipse cx="165" cy="48" rx="34" ry="20" />
          <ellipse cx="80" cy="60" rx="28" ry="14" />
          <ellipse cx="405" cy="85" rx="38" ry="14" />
          <ellipse cx="440" cy="78" rx="26" ry="17" />
          <ellipse cx="660" cy="42" rx="34" ry="13" />
          <ellipse cx="690" cy="36" rx="24" ry="15" />
        </g>

        {/* Skyline — shifted in from the left edge so a tighter mobile crop
            (see the container's aspect-ratio classes) doesn't immediately
            eat into it. */}
        <g fill="var(--color-hairline)" transform="translate(60, 0)">
          <rect x="0" y="200" width="60" height="100" />
          <rect x="70" y="160" width="50" height="140" />
          <rect x="130" y="220" width="70" height="80" />
          <rect x="210" y="140" width="55" height="160" />
          <rect x="275" y="190" width="65" height="110" />
          <rect x="350" y="230" width="80" height="70" />
        </g>
        <g fill="var(--color-graphite)" opacity="0.6" transform="translate(60, 0)">
          <rect x="85" y="180" width="10" height="10" />
          <rect x="85" y="200" width="10" height="10" />
          <rect x="225" y="165" width="10" height="10" />
          <rect x="225" y="185" width="10" height="10" />
          <rect x="225" y="205" width="10" height="10" />
        </g>

        {/* Ground */}
        <rect x="0" y="300" width={VIEW_W} height={VIEW_H - 300} fill="var(--color-hairline)" />

        {/* Trees */}
        <g fill="var(--color-graphite)">
          <rect x="472" y="256" width="12" height="44" />
          <circle cx="478" cy="220" r="42" opacity="0.8" />
          <circle cx="450" cy="235" r="26" opacity="0.6" />
          <circle cx="508" cy="233" r="26" opacity="0.6" />
        </g>
        <g fill="var(--color-graphite)" transform="translate(-45, 0)">
          <rect x="602" y="266" width="10" height="34" />
          <circle cx="607" cy="240" r="30" opacity="0.8" />
          <circle cx="586" cy="252" r="18" opacity="0.6" />
        </g>

        {/* Laptop — every shape below is derived from the bezel bounds so
            the screen and base always connect at the hinge, instead of
            being two independently-placed (and easily misaligned) shapes. */}
        {(() => {
          const pad = 20;
          const bezelX = SCREEN.x - pad;
          const bezelY = SCREEN.y - pad;
          const bezelW = SCREEN.w + pad * 2;
          const bezelH = SCREEN.h + pad * 2;
          const hingeY = bezelY + bezelH;
          const flare = 26;
          const baseH = 20;
          const camX = bezelX + bezelW / 2;

          return (
            <g>
              {/* Base / keyboard deck, top edge exactly matches bezel width+position */}
              <polygon
                points={`${bezelX},${hingeY} ${bezelX + bezelW},${hingeY} ${
                  bezelX + bezelW + flare
                },${hingeY + baseH} ${bezelX - flare},${hingeY + baseH}`}
                fill="var(--color-graphite)"
              />
              <rect
                x={camX - bezelW * 0.32}
                y={hingeY + baseH - 7}
                width={bezelW * 0.64}
                height="3"
                rx="1.5"
                fill="var(--color-void)"
                opacity="0.5"
              />

              {/* Screen bezel, sitting directly on the hinge — no gap, no overlap.
                  Filled like real bezel plastic (matte graphite), not an
                  outline, so it doesn't read as a glowing white frame. */}
              <rect
                x={bezelX}
                y={bezelY}
                width={bezelW}
                height={bezelH}
                rx="10"
                fill="var(--color-graphite)"
              />
              <circle cx={camX} cy={bezelY + 10} r="2.5" fill="var(--color-void)" />

              {/* Screen (inner) */}
              <rect
                x={SCREEN.x}
                y={SCREEN.y}
                width={SCREEN.w}
                height={SCREEN.h}
                fill="var(--color-void)"
                stroke="var(--color-hairline)"
                strokeWidth="2"
              />
            </g>
          );
        })()}
      </svg>

      {/* Real code, positioned to sit exactly inside the SVG screen rect above,
          and centered within it both ways. */}
      <pre
        className="absolute flex items-center justify-center overflow-hidden bg-void font-mono text-[5px] leading-[1.6] text-graphite sm:text-[8px] md:text-[9px]"
        style={{
          left: `${(SCREEN.x / VIEW_W) * 100}%`,
          top: `${(SCREEN.y / VIEW_H) * 100}%`,
          width: `${(SCREEN.w / VIEW_W) * 100}%`,
          height: `${(SCREEN.h / VIEW_H) * 100}%`,
          padding: "4%",
        }}
      >
        <code>
          <Keyword>function</Keyword> stop(site) {"{"}
          {"\n"}
          {"  "}vercel.pause(site);
          {"\n"}
          {"  "}<Keyword>return</Keyword> true;
          {"\n"}
          {"}"}
        </code>
      </pre>
    </div>
  );
}
