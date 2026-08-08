/**
 * The registry marker that opens every section: a label, the section's
 * sequence code (keyed to the RegistryRail), and a one-word descriptor. The
 * numbering is real — it is the same index the rail shows.
 */
export function Eyebrow({
  label,
  code,
  descriptor,
}: {
  label: string;
  code: string;
  descriptor: string;
}) {
  return (
    <p className="t-mono flex flex-wrap items-center gap-x-3 text-graphite">
      <span>{label}</span>
      <span aria-hidden="true">/</span>
      <span className="text-chalk">{code}</span>
      <span aria-hidden="true">/</span>
      <span>{descriptor}</span>
    </p>
  );
}
