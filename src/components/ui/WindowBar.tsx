/** macOS-style title bar (three dots + title) for the terminal and code windows. */
export default function WindowBar({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-[7px] border-b border-white/7 bg-white/5 px-4 py-3"
    >
      <span className="size-[11px] rounded-full bg-[#ff5f57]" />
      <span className="size-[11px] rounded-full bg-[#febc2e]" />
      <span className="size-[11px] rounded-full bg-[#28c840]" />
      {/* Decorative: drawn as generated content so it stays out of the reading order */}
      <span
        data-title={title}
        className="ml-2.5 font-mono text-xs text-white/45 before:content-[attr(data-title)]"
      />
    </div>
  );
}
