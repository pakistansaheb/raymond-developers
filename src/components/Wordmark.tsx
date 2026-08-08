/**
 * The logo is not an image. It is Archivo at the exact weight/width setting
 * used for every headline on the page (`.t-display`) — the brand and the
 * typography are the same object at different sizes. This is the page's one
 * aesthetic risk, documented in the design plan: nothing to invert, infinite
 * crispness, and it turns the identity into a typographic rule rather than
 * an asset.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`t-display inline-block ${className}`}>
      Raymond Developers
    </span>
  );
}
