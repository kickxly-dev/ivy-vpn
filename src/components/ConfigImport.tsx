interface Props {
  onImport: () => void;
  hasConfig: boolean;
}

export function ConfigImport({ onImport, hasConfig }: Props) {
  return (
    <button
      onClick={onImport}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
      style={{
        background: "transparent",
        border: "1px solid rgba(139,92,246,0.25)",
        cursor: "pointer",
        color: "var(--color-text-muted)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = "rgba(139,92,246,0.5)";
        el.style.color = "var(--color-text-primary)";
        el.style.background = "rgba(139,92,246,0.08)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = "rgba(139,92,246,0.25)";
        el.style.color = "var(--color-text-muted)";
        el.style.background = "transparent";
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span style={{ fontSize: 11, letterSpacing: "0.08em" }}>
        {hasConfig ? "Change Config" : "Import Config"}
      </span>
    </button>
  );
}
