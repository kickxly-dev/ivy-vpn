interface Props {
  serverName: string | null;
  endpoint: string | null;
  onImport: () => void;
}

export function ServerCard({ serverName, endpoint, onImport }: Props) {
  if (!serverName) {
    return (
      <button
        onClick={onImport}
        className="w-full rounded-xl flex flex-col items-center justify-center gap-1 py-4 transition-all"
        style={{
          background: "var(--color-bg-card)",
          border: "1px dashed rgba(139,92,246,0.3)",
          cursor: "pointer",
          minHeight: 72,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(139,92,246,0.55)";
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(139,92,246,0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(139,92,246,0.3)";
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--color-bg-card)";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(139,92,246,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <span
          style={{
            fontSize: 11,
            color: "var(--color-text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          Import WireGuard config
        </span>
      </button>
    );
  }

  return (
    <div
      className="w-full rounded-xl px-4 py-3"
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Network icon */}
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 36,
            height: 36,
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-purple-main)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="truncate"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            {serverName}
          </span>
          {endpoint && (
            <span
              className="truncate"
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                fontFamily: "monospace",
                marginTop: 1,
              }}
            >
              {endpoint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
