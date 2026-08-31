/**
 * A real snippet from this codebase (src/lib/vercel.ts), styled as an
 * editor window — not a screenshot, so it stays crisp at any size and
 * needs no image asset. Hand-marked keyword spans rather than a full
 * syntax-highlighter dependency for four lines of decorative code. The
 * site's palette is already monochrome (void/chalk/graphite/signal-white),
 * so no grayscale treatment is needed to satisfy "black and white."
 */
function Keyword({ children }: { children: React.ReactNode }) {
  return <span className="text-chalk">{children}</span>;
}

export function HeroCode() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-xl border border-hairline bg-void/60"
    >
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full border border-graphite" />
        <span className="h-2.5 w-2.5 rounded-full border border-graphite" />
        <span className="h-2.5 w-2.5 rounded-full border border-graphite" />
        <span className="t-mono ml-2 text-graphite">vercel.ts</span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-graphite">
        <code>
          <Keyword>export async function</Keyword> suspendDomain(client) {"{"}
          {"\n"}
          {"  "}<Keyword>const</Keyword> domain = domainFor(client);
          {"\n"}
          {"  "}<Keyword>if</Keyword> (!client.vercelProjectId) <Keyword>return</Keyword>;
          {"\n\n"}
          {"  "}<Keyword>await</Keyword> vercelRequest(
          {"\n"}
          {"    "}
          {`\`/v9/projects/\${id}/domains/\${domain}\``}
          ,{"\n"}
          {"    "}{"{"} method: <Keyword>&quot;DELETE&quot;</Keyword> {"}"},
          {"\n"}
          {"  "});
          {"\n"}
          {"}"}
        </code>
      </pre>
    </div>
  );
}
